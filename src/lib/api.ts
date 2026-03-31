import { env } from 'cloudflare:workers';

/**
 * Fetch wrapper for all API calls. Attaches the API secret key as a header.
 * Must only be called from server-side contexts (SSR pages, API routes).
 *
 * Uses cloudflare:workers env binding to access secrets at runtime.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const baseUrl = import.meta.env.PUBLIC_API_URL;
  if (!baseUrl) throw new Error('PUBLIC_API_URL is not set');

  // @ts-expect-error — API_SECRET_KEY is a Cloudflare secret, not in generated types
  const apiKey: string = env.API_SECRET_KEY;
  if (!apiKey) throw new Error('API_SECRET_KEY is not set');

  const url = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  const callerHeaders = init.headers instanceof Headers || Array.isArray(init.headers)
    ? Object.fromEntries(init.headers as Iterable<[string, string]>)
    : (init.headers ?? {});
  return fetch(url, {
    ...init,
    headers: {
      'X-Api-Key': apiKey,
      ...callerHeaders,
    },
  });
}
