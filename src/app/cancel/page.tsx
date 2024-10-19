// src/app/cancel/page.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto rounded bg-red-100 p-4">
      <h1 className="text-2xl font-bold text-red-700">Réservation annulée</h1>
      <p className="mt-2 text-red-700">
        Votre réservation n&apos;a pas été confirmée. Si c&apos;était une erreur, vous pouvez réessayer.
      </p>
      <button
        onClick={() => router.push('/')}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Retour à l&apos;accueil
      </button>
    </div>
  );
}