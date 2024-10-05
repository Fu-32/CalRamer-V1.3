import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import ThemeSwitcher from '@/components/ThemeSwitcher';

// Utilisation de dynamic pour rendre le composant Calendar côté client uniquement
const Calendar = dynamic(() => import('@/components/Calendar'), { ssr: false });

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ThemeSwitcher />
      <Calendar />
      <Features />
      <Pricing />
      <Contact />
    </>
  );
}