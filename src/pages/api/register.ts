import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { apiFetch } from '../../lib/api';

export const prerender = false;

interface RegisterBody {
  eventId?: string;
  referralCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  claimedSeatCount?: number;
  foodChoiceOptionId?: string;
  foodChoiceAllergies?: string;
  termsAccepted?: boolean;
  turnstileToken?: string;
}

interface BackendPayload {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  claimedSeatCount: number;
  foodChoice?: { optionId: string; allergies: string };
  hasAcceptedAllTerms?: boolean;
}

export const POST: APIRoute = async ({ request }) => {
  let body: RegisterBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { eventId, referralCode, firstName, lastName, email, company, claimedSeatCount, turnstileToken } = body;

  // Verify Turnstile token before any field validation
  if (!turnstileToken) {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // @ts-expect-error — TURNSTILE_SECRET_KEY is a Cloudflare secret, not in generated types
  const turnstileSecret: string = env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) throw new Error('TURNSTILE_SECRET_KEY is not set');

  const turnstileForm = new FormData();
  turnstileForm.append('secret', turnstileSecret);
  turnstileForm.append('response', turnstileToken);

  let turnstileOk: boolean;
  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: turnstileForm,
    });
    const outcome = await verifyRes.json() as { success: boolean };
    turnstileOk = outcome.success === true;
  } catch (err) {
    console.error('[register] Turnstile verification fetch failed:', err);
    return new Response(JSON.stringify({ error: true }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!turnstileOk) {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!eventId || !referralCode || !firstName || !lastName || !email) {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const seatCount = claimedSeatCount ?? 1;
  if (!Number.isInteger(seatCount) || seatCount < 1 || seatCount > 100) {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload: BackendPayload = {
    firstName,
    lastName,
    email,
    company: company ?? '',
    claimedSeatCount: seatCount,
  };

  if (body.foodChoiceOptionId) {
    payload.foodChoice = {
      optionId: body.foodChoiceOptionId,
      allergies: body.foodChoiceAllergies ?? '',
    };
  }

  if (body.termsAccepted !== undefined) {
    payload.hasAcceptedAllTerms = body.termsAccepted;
  }

  let response: Response;
  try {
    response = await apiFetch(
      `/api/events/public/${encodeURIComponent(eventId)}/${encodeURIComponent(referralCode)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
  } catch (err) {
    console.error('[register] apiFetch failed:', err);
    return new Response(JSON.stringify({ error: true }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (response.ok) {
    const data = await response.json() as { nextStep: string };
    return new Response(JSON.stringify({ nextStep: data.nextStep }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const errorBody = await response.text().catch(() => '');
  console.error(`[register] backend error ${response.status}:`, errorBody);
  return new Response(JSON.stringify({ error: true }), {
    status: response.status >= 400 && response.status < 500 ? response.status : 502,
    headers: { 'Content-Type': 'application/json' },
  });
};
