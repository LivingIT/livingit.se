import type { APIRoute } from 'astro';
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

  const { eventId, referralCode, firstName, lastName, email, company, claimedSeatCount } = body;

  if (!eventId || !referralCode || !firstName || !lastName || !email) {
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
    claimedSeatCount: claimedSeatCount ?? 1,
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
