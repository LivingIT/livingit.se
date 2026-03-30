import type { APIRoute } from 'astro';
import { apiFetch } from '../../lib/api';

export const prerender = false;

interface PurchaseBody {
  eventId?: string;
  email?: string;
  seatCount?: number;
  termsAccepted?: boolean;
}

interface BackendPurchasePayload {
  email: string;
  seatCount: number;
  hasAcceptedAllTerms?: boolean;
}

export const POST: APIRoute = async ({ request }) => {
  let body: PurchaseBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { eventId, email, seatCount } = body;

  if (!eventId || !email) {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const seats = seatCount ?? 0;
  if (!Number.isInteger(seats) || seats < 1 || seats > 100) {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload: BackendPurchasePayload = { email, seatCount: seats };
  if (body.termsAccepted !== undefined) {
    payload.hasAcceptedAllTerms = body.termsAccepted;
  }

  let response: Response;
  try {
    response = await apiFetch(
      `/api/events/public/${encodeURIComponent(eventId)}/orders`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
  } catch (err) {
    console.error('[purchase] apiFetch failed:', err);
    return new Response(JSON.stringify({ error: true }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (response.ok) {
    const data = await response.json() as { checkoutUrl: string };
    return new Response(JSON.stringify({ checkoutUrl: data.checkoutUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const errorBody = await response.text().catch(() => '');
  console.error(`[purchase] backend error ${response.status}:`, errorBody);
  return new Response(JSON.stringify({ error: true }), {
    status: response.status >= 400 && response.status < 500 ? response.status : 502,
    headers: { 'Content-Type': 'application/json' },
  });
};
