import axios from 'axios';
import { toast } from 'sonner';

let isRedirecting = false;

// Set default timeout for all axios requests (15s to handle Vercel cold starts)
axios.defaults.timeout = 15000;

// Add response interceptor to handle auth errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.error('Request timeout or network error:', error.message);
      // Don't logout on timeout - backend might be cold starting
      toast.error('Server is starting up. Please try again in a moment.');
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      
      // Clear persisted state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root');
        
        // Show error message
        toast.error('Session expired. Please login again.');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/auth/login';
          isRedirecting = false;
        }, 1000);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;
