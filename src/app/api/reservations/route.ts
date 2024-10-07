// src/app/api/reservations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Reservations from '../../../models/Reservations';

export async function POST(request: NextRequest) {
  console.log('Connecting to database...');
  await dbConnect();
  console.log('Connected to database.');

  try {
    const body = await request.json();
    const { startDate, endDate, userId } = body;

    // Validation des données reçues
    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Les champs startDate et endDate sont requis.' },
        { status: 400 }
      );
    }

    // Création de la nouvelle réservation
    const newReservations = new Reservations({
      startDate,
      endDate,
      userId,
      status: 'confirmed',
    });

    await newReservations.save();

    console.log('New Reservations:', newReservations);

    return NextResponse.json({ success: true, data: newReservations }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log('Connecting to database...');
  await dbConnect();
  console.log('Connected to database.');

  const { searchParams } = new URL(request.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  let filter = {};

  if (startDateParam && endDateParam) {
    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);

    filter = {
      startDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  }

  console.log('Filter:', filter);

  try {
    const reservations = await Reservations.find(filter).select('startDate endDate');
    console.log('Reservations:', reservations);
    return NextResponse.json({ success: true, data: reservations }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}


