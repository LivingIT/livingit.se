import type { APIRoute } from 'astro';
import { apiFetch } from '../../lib/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { eventId?: string; referralCode?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { eventId, referralCode } = body;
  if (!eventId || !referralCode) {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let response: Response;
  try {
    response = await apiFetch(
      `/api/events/public/${encodeURIComponent(eventId)}/${encodeURIComponent(referralCode)}`
    );
  } catch (err) {
    console.error('[validate-ticket] apiFetch failed:', err);
    return new Response(JSON.stringify({ error: true }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (response.ok) {
    const data = await response.json() as { maxSeatCount: number };
    return new Response(JSON.stringify({ maxSeatCount: data.maxSeatCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: true }), {
    status: response.status === 404 ? 404 : 502,
    headers: { 'Content-Type': 'application/json' },
  });
};
