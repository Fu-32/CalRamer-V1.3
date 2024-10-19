// src/app/api/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseClient } from '../../../lib/supabaseClient';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey || !stripeWebhookSecret) {
  throw new Error(
    "Les clés STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET sont nécessaires dans les variables d'environnement."
  );
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-09-30.acacia', // Assurez-vous que cette version est correcte
});

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  let event: Stripe.Event;

  // Vérifier si la signature est présente et de type string
  if (typeof sig !== 'string') {
    console.error('Missing Stripe signature.');
    return new NextResponse('Missing Stripe signature.', { status: 400 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret as string);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Webhook signature verification failed.', err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }
    console.error('Webhook signature verification failed.', err);
    return new NextResponse('Webhook signature verification failed.', { status: 400 });
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Récupérer les informations client
    const customerEmail = session.customer_details?.email || '';
    const customerName = session.customer_details?.name || '';
    const customerPhone = session.customer_details?.phone || '';
    const billingAddress = session.customer_details?.address || null;

    // Logique pour enregistrer les données dans Supabase
    try {
      const { data, error } = await supabaseClient
        .from('reservations')
        .insert([
          {
            user_id: session.client_reference_id || 'unknown', // Assurez-vous de définir cela correctement
            email: customerEmail,
            phone: customerPhone,
            name: customerName,
            billing_address: billingAddress ? JSON.stringify(billingAddress) : null,
            // Ajoutez d'autres champs selon votre schéma
            // Par exemple, dates, montant, etc.
          },
        ]);

      if (error) {
        console.error('Erreur lors de l\'insertion dans Supabase:', error);
        return new NextResponse(`Supabase Error: ${error.message}`, { status: 400 });
      }

      console.log('Réservation enregistrée avec succès dans Supabase:', data);
    } catch (error) {
      console.error('Erreur lors de la gestion du webhook:', error);
      return new NextResponse('Webhook handler failed.', { status: 500 });
    }
  }

  // Retourner une réponse 200 pour indiquer que le webhook a été reçu avec succès
  return new NextResponse(null, { status: 200 });
}