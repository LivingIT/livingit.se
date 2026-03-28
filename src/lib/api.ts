const baseUrl = import.meta.env.PUBLIC_API_URL;
const apiKey = import.meta.env.API_SECRET_KEY;

/**
 * Fetch wrapper for all API calls. Attaches the API secret key as a Bearer
 * token. Must only be called from server-side contexts (SSR pages, API routes).
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'X-Api-Key': apiKey,
      ...init.headers,
    },
  });
}
