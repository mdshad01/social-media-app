import { BASE_API_URL } from "@/server";

/**
 * Warms up the backend by pinging the health endpoint
 * This helps reduce cold start issues on Vercel
 */
export const warmupBackend = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't wait too long for warmup
      signal: AbortSignal.timeout(3000),
    });
    
    return response.ok;
  } catch (error) {
    console.log('Backend warmup failed (this is normal on first load):', error);
    return false;
  }
};
