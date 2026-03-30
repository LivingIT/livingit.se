import type { APIRoute } from 'astro';
import { apiFetch } from '../../lib/api';

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

  const response = await apiFetch(
    `/api/events/public/${encodeURIComponent(eventId)}/${encodeURIComponent(referralCode)}`
  );

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
