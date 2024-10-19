// src/app/api/get-session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "La clé secrète Stripe STRIPE_SECRET_KEY est manquante dans les variables d'environnement."
  );
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-09-30.acacia', // Assurez-vous que cette version est correcte
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Aucun identifiant de session fourni.' },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer'],
    });

    return NextResponse.json({ session });
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération de la session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la session Stripe.' },
      { status: 500 }
    );
  }
}