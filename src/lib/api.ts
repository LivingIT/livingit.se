if (typeof window !== 'undefined') {
  throw new Error('api.ts must only be imported from server-side contexts');
}

const baseUrl = import.meta.env.PUBLIC_API_URL;
if (!baseUrl) throw new Error('PUBLIC_API_URL is not set');

const apiKey = import.meta.env.API_SECRET_KEY;
if (!apiKey) throw new Error('API_SECRET_KEY is not set');

/**
 * Fetch wrapper for all API calls. Attaches the API secret key as a Bearer
 * token. Must only be called from server-side contexts (SSR pages, API routes).
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  const callerHeaders = init.headers instanceof Headers
    ? Object.fromEntries(init.headers)
    : (init.headers ?? {});
  console.log('[apiFetch] URL:', url);
  console.log('[apiFetch] API key (first 6 chars):', apiKey?.slice(0, 6) ?? 'MISSING');
  const response = await fetch(url, {
    ...init,
    headers: {
      'X-Api-Key': apiKey,
      ...callerHeaders,
    },
  });
  console.log('[apiFetch] Response status:', response.status, response.statusText);
  return response;
}
