// src/app/api/test/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Votre code pour les requêtes GET
  console.log('GET request received at /api/test');
  return NextResponse.json({ message: 'La route API fonctionne !' });
}

export async function POST(request: NextRequest) {
  // Votre code pour les requêtes POST
  console.log('POST request received at /api/test');
  return NextResponse.json({ message: 'POST request received' });
}