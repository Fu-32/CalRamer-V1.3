import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Reservations {
    id: number;
    start_date: string;
    end_date: string;
}

const supabaseUrl = 'https://votre-supabase-url.supabase.co'; // Remplacez par votre URL
const supabaseKey = 'votre-supabase-anon-key'; // Remplacez par votre clé anonyme
const supabase = createClient(supabaseUrl, supabaseKey);

const TestSupaDb: React.FC = () => {
    const [data, setData] = useState<Reservations[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('[TestSupaDb] Composant monté');
        console.log('[TestSupaDb] useEffect triggered');
        
        const fetchData = async () => {
            console.log('[Supabase] Début de la récupération des données...');
            try {
                const { data: reservations, error } = await supabase
                    .from('reservations') // Assurez-vous que le nom de la table est correct
                    .select('*');

                if (error) {
                    console.error('[Supabase] Erreur de récupération:', error.message);
                    throw error;
                }

                console.log('[Supabase] Données récupérées:', reservations);
                setData(reservations || []); // Assurez-vous que 'reservations' n'est pas null
            } catch (error) {
                console.error('[Supabase] Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
                console.log('[Supabase] Fin de la récupération des données.');
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="overflow-x-auto p-4">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th className="bg-gray-700">ID</th>
                        <th className="bg-gray-700">Start Date</th>
                        <th className="bg-gray-700">End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{item.id}</td>
                            <td className="border px-4 py-2">{item.start_date}</td>
                            <td className="border px-4 py-2">{item.end_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TestSupaDb;