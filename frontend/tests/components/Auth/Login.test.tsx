import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/components/Auth/Login';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe('Login Component', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
  };

  describe('Rendering', () => {
    it('should render login form with all elements', () => {
      renderLogin();

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
      renderLogin();

      const forgotPasswordLink = screen.getByText(/forgot password/i);
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink).toHaveAttribute('href', '/auth/forget-password');
    });

    it('should render signup link', () => {
      renderLogin();

      const signupLink = screen.getByText(/create account/i);
      expect(signupLink).toBeInTheDocument();
      expect(signupLink).toHaveAttribute('href', '/auth/signup');
    });

    it('should render features section', () => {
      renderLogin();

      // Features appear in both desktop and mobile views
      const seamlessSharing = screen.getAllByText('Seamless Sharing');
      expect(seamlessSharing.length).toBeGreaterThan(0);
      
      const engageWithFriends = screen.getAllByText('Engage with Friends');
      expect(engageWithFriends.length).toBeGreaterThan(0);
      
      // These only appear once (desktop only)
      expect(screen.getByText('Smart Feed')).toBeInTheDocument();
      expect(screen.getByText('Private & Secure')).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('should update email input when user types', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password input when user types', async () => {
      const user = userEvent.setup();
      renderLogin();

      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      await user.type(passwordInput, 'password123');

      expect(passwordInput.value).toBe('password123');
    });

    it('should have email input with correct type', () => {
      renderLogin();

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Form Submission', () => {
    it('should call API with correct data on successful login', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          data: {
            user: {
              _id: '123',
              email: 'test@example.com',
              username: 'testuser',
              isDeleted: false,
            },
          },
          message: 'Login successful',
        },
      };

      (axios.post as any).mockResolvedValue(mockResponse);

      renderLogin();

      // Fill form
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      // Submit
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Wait for API call
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/users/login'),
          { email: 'test@example.com', password: 'password123' },
          { withCredentials: true }
        );
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      
      // Mock a delayed response
      (axios.post as any).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          data: {
            data: {
              user: { isDeleted: false },
            },
            message: 'Success',
          },
        }), 100))
      );

      renderLogin();

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Button should be disabled during loading
      expect(submitButton).toBeDisabled();
    });

    it('should redirect to home page after successful login', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          data: {
            user: {
              _id: '123',
              email: 'test@example.com',
              isDeleted: false,
            },
          },
          message: 'Login successful',
        },
      };

      (axios.post as any).mockResolvedValue(mockResponse);

      renderLogin();

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Deactivated Account Flow', () => {
    it('should show reactivate modal for deactivated account', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          data: {
            user: {
              _id: '123',
              email: 'test@example.com',
              isDeleted: true,
              deletionExecuteAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          message: 'Login successful',
        },
      };

      (axios.post as any).mockResolvedValue(mockResponse);

      renderLogin();

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Account Deactivated')).toBeInTheDocument();
      });
    });

    it('should close reactivate modal when cancel is clicked', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          data: {
            user: {
              _id: '123',
              isDeleted: true,
              deletionExecuteAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          message: 'Login successful',
        },
      };

      (axios.post as any).mockResolvedValue(mockResponse);

      renderLogin();

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Account Deactivated')).toBeInTheDocument();
      });

      // Click cancel
      await user.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Account Deactivated')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      
      (axios.post as any).mockRejectedValue({
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      });

      renderLogin();

      await user.type(screen.getByLabelText(/email address/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Button should be enabled again after error
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      renderLogin();

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should have submit button with proper role', () => {
      renderLogin();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
});
