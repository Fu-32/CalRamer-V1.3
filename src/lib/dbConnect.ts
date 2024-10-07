// lib/dbConnect.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Veuillez définir la variable d\'environnement MONGODB_URI dans votre fichier .env.local');
}

/**
 * Utilisez une variable globale pour mettre en cache la connexion lors du rechargement à chaud en développement.
 * Cela évite d'établir de nouvelles connexions à chaque fois.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new database connection promise');
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Database connection established');
      return mongoose;
    }).catch((error) => {
      console.error('Database connection error:', error);
      throw error;
    });
  } else {
    console.log('Using existing database connection promise');
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;