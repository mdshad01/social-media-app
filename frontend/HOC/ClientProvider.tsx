"use client";
import store from "@/store/store";
import { ReactNode, useState, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { HomeSkeleton } from "@/components/Skeleton";
import { RootState } from "@/store/store";
import { setAuthUser } from "@/store/authSlice";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { useRouter } from "next/navigation";
import { warmupBackend } from "@/lib/warmupBackend";

// Create persistor outside component to avoid recreation on re-renders
const persistor = persistStore(store);

// Session validator component
const SessionValidator = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isValidating, setIsValidating] = useState(true);
  const [hasValidated, setHasValidated] = useState(false);

  useEffect(() => {
    // Only validate once
    if (hasValidated) return;

    const validateSession = async () => {
      // If we have a user in Redux, validate with backend
      if (user) {
        try {
          // First, try to warm up the backend (non-blocking)
          warmupBackend();
          
          // Wait a bit for warmup to complete
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Use /users/me endpoint to validate session
          // Increased timeout to 15s to handle Vercel cold starts
          const response = await axios.get(`${BASE_API_URL}/users/me`, {
            withCredentials: true,
            timeout: 15000, // 15 seconds for cold start
          });
          
          if (response.data.status === 'success') {
            // Session is valid, update user data
            dispatch(setAuthUser(response.data.data.user));
          }
        } catch (error) {
          // Session invalid or expired
          const axiosError = error as { response?: { status?: number }, code?: string };
          console.error('Session validation failed:', axiosError?.response?.status || axiosError?.code);
          
          // Only clear session on auth errors, not on timeout/network errors
          if (axiosError?.response?.status === 401 || axiosError?.response?.status === 403) {
            // Clear invalid session
            dispatch(setAuthUser(null));
            
            // Only redirect if we're not already on auth pages
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/auth')) {
              router.push('/auth/login');
            }
          }
          // If timeout or network error, keep user logged in (they might have valid session)
          // The global 401 interceptor will handle actual auth failures
        }
      }
      
      setIsValidating(false);
      setHasValidated(true);
    };

    // Validate session after a small delay
    const timer = setTimeout(validateSession, 200);
    return () => clearTimeout(timer);
  }, [user, dispatch, router, hasValidated]);

  if (isValidating && user) {
    return <HomeSkeleton />;
  }

  return <>{children}</>;
};

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [isRehydrated, setIsRehydrated] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate 
        loading={<HomeSkeleton />} 
        persistor={persistor}
        onBeforeLift={() => {
          // This ensures we wait for rehydration before rendering
          return new Promise((resolve) => {
            setTimeout(() => {
              setIsRehydrated(true);
              resolve();
            }, 100); // Small delay to ensure state is fully loaded
          });
        }}
      >
        {isRehydrated ? (
          <SessionValidator>
            {children}
          </SessionValidator>
        ) : (
          <HomeSkeleton />
        )}
      </PersistGate>
    </Provider>
  );
};

export default ClientProvider;
