// src/lib/stripeClient.ts

import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;

    if (!stripePublicKey) {
      throw new Error('La clé publique Stripe NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY est manquante');
    }

    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

