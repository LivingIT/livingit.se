if (typeof window !== 'undefined') {
  throw new Error('api.ts must only be imported from server-side contexts');
}

/**
 * Fetch wrapper for all API calls. Attaches the API secret key as a Bearer
 * token. Must only be called from server-side contexts (SSR pages, API routes).
 *
 * apiKey must be passed by the caller from Astro.locals.runtime.env.API_SECRET_KEY
 * (or context.locals.runtime.env.API_SECRET_KEY in API routes). Cloudflare secrets
 * are not available via import.meta.env — only via the Worker runtime env.
 */
export async function apiFetch(path: string, apiKey: string, init: RequestInit = {}): Promise<Response> {
  const baseUrl = import.meta.env.PUBLIC_API_URL;
  if (!baseUrl) throw new Error('PUBLIC_API_URL is not set');
  if (!apiKey) throw new Error('API_SECRET_KEY is not set');

  const url = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  const callerHeaders = init.headers instanceof Headers
    ? Object.fromEntries(init.headers)
    : (init.headers ?? {});
  return fetch(url, {
    ...init,
    headers: {
      'X-Api-Key': apiKey,
      ...callerHeaders,
    },
  });
}
