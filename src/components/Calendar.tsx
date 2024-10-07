"use client";

import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import 'tailwindcss/tailwind.css';
import { supabase } from '../lib/supabaseClient';
import isBetween from 'dayjs/plugin/isBetween';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

dayjs.locale('fr');
dayjs.extend(isBetween);

// Log essentiel lors de l'initialisation de Supabase
console.log('[Supabase] Initialisation réussie');

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  interface Reservations {
    id: number;
    start_date: string;
    end_date: string;
  }

  const [reservations, setReservations] = useState<Reservations[]>([]);

  // Calcul des dates pour le calendrier
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startOfWeek = startOfMonth.startOf('week');
  const endOfWeek = endOfMonth.endOf('week');

  const days = [];
  let day = startOfWeek;

  while (day.isBefore(endOfWeek, 'day') || day.isSame(endOfWeek, 'day')) {
    days.push(day);
    day = day.add(1, 'day');
  }

  const fetchReservations = async () => {
    console.log('[Supabase] Récupération des réservations...');
    const { data, error } = await supabase.from('reservations').select('*');
    if (error) {
      console.error('[Supabase] Erreur de récupération:', error.message);
    } else {
      console.log('[Supabase] Réservations récupérées:', data.length);
      setReservations(data);
    }
  };

  useEffect(() => {
    fetchReservations();

    const channel = supabase
      .channel('reservations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        (payload: RealtimePostgresChangesPayload<Reservations>) => {
          console.log('[Supabase] Changement reçu:', payload.eventType);
          fetchReservations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fonctions de navigation
  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  // Gestion de la sélection des dates
  const handleDateClick = (clickedDay: Dayjs) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDay);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (clickedDay.isBefore(startDate)) {
        setStartDate(clickedDay);
      } else {
        setEndDate(clickedDay);
      }
    }
  };

  const isInRange = (day: Dayjs) => {
    if (startDate && endDate) {
      return day.isAfter(startDate) && day.isBefore(endDate);
    }
    return false;
  };

  const isSelected = (day: Dayjs) => {
    return day.isSame(startDate, 'day') || day.isSame(endDate, 'day');
  };

  const isReserved = (day: Dayjs) => {
    return reservations.some((reservations) => {
      const start = dayjs(reservations.start_date);
      const end = dayjs(reservations.end_date);
      return day.isBetween(start, end, 'day', '[]');
    });
  };

  const handleReserve = async () => {
    if (startDate && endDate) {
      try {
        console.log('[Supabase] Création de la réservation...');
        const { data, error } = await supabase.from('reservations').insert([
          {
            start_date: startDate.format('YYYY-MM-DD'),
            end_date: endDate.format('YYYY-MM-DD'),
          },
        ]);

        if (error) {
          if (error.message.includes('reservations_no_overlap')) {
            alert('Ces dates sont déjà réservées. Veuillez choisir une autre plage.');
          } else {
            console.error('[Supabase] Erreur de création:', (error as unknown as Error).message);
            alert('Erreur lors de la création de la réservation.');
          }
        } else {
          console.log('[Supabase] Réservation créée:', data ? (data as Reservations[]).length : 0);
          alert('Réservation réussie !');
          setStartDate(null);
          setEndDate(null);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('[Supabase] Erreur de création:', error.message);
        } else {
          console.error('[Supabase] Erreur de création:', error);
        }
        alert('Erreur lors de la création de la réservation.');
      }
    } else {
      alert('Veuillez sélectionner une plage de dates.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-primary border border-gray-800 rounded-lg shadow-md">
      {/* Affichage des dates de début et de fin sélectionnées */}
      <div className="mb-4">
        <h3 className="text-lg font-bold">Dates de réservation</h3>
        <p>
          Du: {startDate ? startDate.format('DD/MM/YYYY') : '../../....'} Au: {endDate ? endDate.format('DD/MM/YYYY') : '../../....'}
        </p>
      </div>

      {/* En-tête du calendrier avec la navigation */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {currentDate.format('MMMM YYYY').charAt(0).toUpperCase() + currentDate.format('MMMM YYYY').slice(1)}
        </h2>
        <div className="ml-auto flex space-x-2">
          <button onClick={handlePrevMonth} className="px-4 py-2 bg-secondary rounded">Précédent</button>
          <button onClick={handleNextMonth} className="px-4 py-2 bg-secondary rounded">Suivant</button>
        </div>
      </div>

      {/* Grille des jours du calendrier */}
      <div className="aspect-w-1 aspect-h-1">
        <div className="grid grid-cols-7 h-full gap-y-0">
          {/* En-tête des jours de la semaine */}
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((dayName) => (
            <div key={dayName} className="text-center font-bold text-sm">{dayName}</div>
          ))}

          {/* Affichage des jours */}
          {days.map((day) => {
            const reserved = isReserved(day);
            return (
              <div
                key={day.toString()}
                className={`text-center p-0 w-full h-12 flex items-center justify-center font-bold
                  ${day.month() !== currentDate.month() ? 'text-gray-400' : ''}
                  ${isSelected(day) ? 'bg-secondary text-accent rounded-full' : ''}
                  ${isInRange(day) ? 'bg-gray-700 rounded' : ''}
                  ${reserved ? 'bg-red-500 text-white cursor-not-allowed' : 'hover:bg-secondary cursor-pointer'}
                `}
                onClick={() => !reserved && handleDateClick(day)}
              >
                {day.date()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bouton de réservation */}
      <div className="mt-4">
        <button onClick={handleReserve} className="px-4 py-2 bg-secondary rounded">
          Réserver
        </button>
      </div>
    </div>
  );
};

export default Calendar;