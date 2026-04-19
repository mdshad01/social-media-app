import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoadingButton from '@/components/Helper/LoadingButton';

describe('LoadingButton Component', () => {
  it('should render button with text', () => {
    render(<LoadingButton>Submit</LoadingButton>);
    
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should show loading spinner when isLoading is true', () => {
    render(<LoadingButton isLoading={true}>Submit</LoadingButton>);
    
    // Check if Loader icon is present (it has animate-spin class)
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should disable button when loading', () => {
    render(<LoadingButton isLoading={true}>Submit</LoadingButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not be disabled when not loading', () => {
    render(<LoadingButton isLoading={false}>Submit</LoadingButton>);
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should call onClick when clicked and not loading', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<LoadingButton onClick={handleClick}>Submit</LoadingButton>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when loading', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<LoadingButton isLoading={true} onClick={handleClick}>Submit</LoadingButton>);
    
    const button = screen.getByRole('button');
    // Try to click (should not work because button is disabled)
    await user.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should pass additional props to Button', () => {
    render(
      <LoadingButton className="custom-class" type="submit">
        Submit
      </LoadingButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
