// src/app/success/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Définir une interface pour le type de session
interface CheckoutSession {
  customer_email?: string;
  // Ajoutez d'autres champs selon vos besoins
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // Récupérer les détails de la session via une route API dédiée
      const fetchSession = async () => {
        try {
          const response = await fetch(`/api/get-session?sessionId=${sessionId}`);
          const data = await response.json();
          if (response.ok) {
            setSession(data.session);
          } else {
            setError(data.error || 'Erreur lors de la récupération de la session.');
          }
        } catch {
          setError('Erreur réseau.');
        } finally {
          setLoading(false);
        }
      };

      fetchSession();
    } else {
      setError('Aucun identifiant de session fourni.');
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto rounded bg-green-100 p-4">
      <h1 className="text-2xl font-bold text-green-700">Merci pour votre réservation !</h1>
      <p className="mt-2 text-green-700">
        Votre réservation a été confirmée. Un e-mail de confirmation a été envoyé à {session?.customer_email}.
      </p>
      {/* Ajoutez d'autres détails si nécessaire */}
    </div>
  );
}