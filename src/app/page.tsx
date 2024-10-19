//"use client";
//
//import CalendrierV2 from '@/components/CalendrierV2'
//import Navbar from '@/components/Navbar';
//import Hero from '@/components/Hero';
//import Features from '@/components/Features';
//import Pricing from '@/components/Pricing';
//import Contact from '@/components/Contact';
//import ThemeSwitcher from '@/components/ThemeSwitcher';
//// import Calendar from '@/components/Calendar'; // Import direct du composant
//
//// import TestSupaDb from '@/components/Test-Supa-Db';
//
//// Utilisation de dynamic pour rendre le composant Calendar côté client uniquement
//// const Calendar = dynamic(() => import('@/components/Calendar'), { ssr: false });
//
//import { useEffect, useState } from 'react';
//import { supabase } from '@/lib/supabaseClient';
//
//interface Reservations{
//  id: number;
//  start_date: string;
//  end_date: string;
//}
//
//export default function Home() {
//  const [data, setData] = useState<Reservations[]>([]);
//  const [loading, setLoading] = useState(true);
//
//  useEffect(() => {
//    const fetchData = async () => {
//      console.log('[Supabase] Début de la récupération des données...');
//      try {
//        const { data: reservations, error } = await supabase
//          .from('reservations')
//          .select('*');
      //
//        if (error) {
//          console.error('[Supabase] Erreur de récupération:', error.message);
//          throw error;
//        }
      //
//        console.log('[Supabase] Données récupérées:', reservations);
//        setData(reservations);
//      } catch (error) {
//        console.error('[Supabase] Erreur lors de la récupération des données:', error);
//      } finally {
//        setLoading(false);
//        console.log('[Supabase] Fin de la récupération des données.');
//      }
//    };
  //
//    fetchData();
//  }, []);
//
//  return (
//    <>
//      <Navbar />
//      <Hero />
//      <ThemeSwitcher />      
//      <CalendrierV2 />
//      <Features />
//      <Pricing />
//      <Contact />
//    </>
//  );
//}
//
//

// page.tsx


import CalendrierV2 from '@/components/CalendrierV2';

export default function Page() {
  return (
    <div>
      <h1>Mon Calendrier</h1>
      <CalendrierV2 />
      <h2 className="mt-8">Mon contenu</h2>
      
    </div>
  );
}