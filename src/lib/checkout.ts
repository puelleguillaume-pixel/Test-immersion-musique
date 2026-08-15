import type { CheckoutPayload } from "@/types";

const CHECKOUT_WEBHOOK_URL = import.meta.env.VITE_CHECKOUT_WEBHOOK_URL;
const CONTACT_WEBHOOK_URL = import.meta.env.VITE_CONTACT_WEBHOOK_URL;

export const isCheckoutConfigured = Boolean(CHECKOUT_WEBHOOK_URL);
export const isContactConfigured = Boolean(CONTACT_WEBHOOK_URL);

/**
 * Calls the Google Apps Script webhook that creates a Stripe Checkout
 * session (or any equivalent payment link) and emails the download link
 * once payment succeeds. The script is expected to accept a POST of
 * `CheckoutPayload` and respond with `{ url: string }`.
 */
export async function createCheckoutSession(
  payload: CheckoutPayload,
): Promise<{ url: string }> {
  if (!CHECKOUT_WEBHOOK_URL) {
    throw new Error(
      "Le paiement n'est pas encore configuré (VITE_CHECKOUT_WEBHOOK_URL manquant).",
    );
  }

  const res = await fetch(CHECKOUT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Impossible de créer la session de paiement.");
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) {
    throw new Error("Réponse de paiement invalide.");
  }
  return { url: data.url };
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  if (!CONTACT_WEBHOOK_URL) {
    throw new Error(
      "Le formulaire n'est pas encore connecté (VITE_CONTACT_WEBHOOK_URL manquant).",
    );
  }

  const res = await fetch(CONTACT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Envoi impossible pour le moment.");
  }
}
