// src/app/api/reservations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '../../../lib/supabaseClient';

// // Définir une interface pour la réservation
// interface Reservation {
//   id: number;
//   rental_id: number;
//   user_id: string; // UUID
//   start_date: string; // ISO string
//   end_date: string; // ISO string
//   created_at: string;
//   updated_at: string;
// }
// 

// Définir une interface pour les données d'insertion
interface InsertReservation {
  rental_id: number;
  user_id: string; // UUID
  start_date: string; // ISO string
  end_date: string; // ISO string
}

export async function POST(request: NextRequest) {
  try {
    console.log('Receiving POST request for new reservation.');

    // Extraire le corps de la requête
    const body = await request.json();
    const { startDate, endDate, userId, rentalId } = body;

    // Validation des données reçues
    if (!startDate || !endDate || !userId || !rentalId) {
      return NextResponse.json(
        { success: false, error: 'Les champs startDate, endDate, userId et rentalId sont requis.' },
        { status: 400 }
      );
    }

    // Préparer les données pour l'insertion
    const newReservation: InsertReservation = {
      rental_id: rentalId,
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    };

    // Insérer la nouvelle réservation dans Supabase et récupérer les données insérées
    const { data, error } = await supabaseClient
      .from('reservations')
      .insert([newReservation]) // Passer un tableau d'objets
      .select(); // Utiliser .select() pour récupérer les données insérées

    if (error) {
      console.error('Erreur lors de l\'insertion de la réservation:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('Nouvelle réservation insérée:', data);

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Erreur inattendue lors du POST:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Receiving GET request for reservations.');

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    console.log('Paramètres de recherche:', { startDateParam, endDateParam });

    // Construire la requête Supabase avec des filtres conditionnels
    let query = supabaseClient
      .from('reservations')
      .select('id, rental_id, user_id, start_date, end_date, created_at, updated_at');

    if (startDateParam) {
      query = query.gte('start_date', new Date(startDateParam).toISOString());
    }

    if (endDateParam) {
      query = query.lte('end_date', new Date(endDateParam).toISOString());
    }

    // Récupérer les réservations depuis Supabase
    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('Réservations récupérées:', data);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Erreur inattendue lors du GET:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}