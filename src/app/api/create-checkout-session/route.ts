// src/app/api/create-checkout-session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dayjs from 'dayjs';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "La clé secrète Stripe STRIPE_SECRET_KEY est manquante dans les variables d'environnement."
  );
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-09-30.acacia', // Assurez-vous que cette version est correcte
});

export async function POST(request: NextRequest) {
  console.log('Received POST request to /api/create-checkout-session');

  try {
    const { selectedDates } = await request.json();

    if (!selectedDates || selectedDates.length < 1) {
      return NextResponse.json(
        { error: 'Aucune date sélectionnée.' },
        { status: 400 }
      );
    }

    // Convertir les dates en objets dayjs
    const dates = selectedDates.map((dateStr: string) => dayjs(dateStr));

    // S'assurer que les dates sont triées
    dates.sort((a: dayjs.Dayjs, b: dayjs.Dayjs) => a.valueOf() - b.valueOf());

    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    const numberOfNights = endDate.diff(startDate, 'day') + 1;


    // Btw je dois changer mon mode de calcul des nuits.
    const pricePerNight = 5000; // 50€ en centimes
    // const totalAmount = numberOfNights * pricePerNight;

    // Créer la session de paiement avec collecte des informations personnelles
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Réservation',
              description: `Réservation du ${startDate.format('DD/MM/YYYY')} au ${endDate.format('DD/MM/YYYY')}`,
            },
            unit_amount: pricePerNight,
          },
          quantity: numberOfNights,
        },
      ],
      mode: 'payment',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH'],
      },
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cancel`,
    });

    console.log('Stripe checkout session created:', session);

    return NextResponse.json({ sessionId: session.id });
  } catch (error: unknown) {
    console.error('Erreur lors de la création de la session de paiement:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: 'Erreur avec la requête Stripe: ' + error.message },
        { status: 400 }
      );
    } else if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Une erreur est survenue: ' + error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'Une erreur inconnue est survenue.' },
        { status: 500 }
      );
    }
  }
}
