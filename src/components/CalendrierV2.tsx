// src/components/CalendrierV2.tsx
"use client";

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'; // Import du plugin isBetween
import { supabase } from '../lib/supabaseClient';

// Étendre dayjs avec le plugin isBetween
dayjs.extend(isBetween);

interface Reservation {
    id: number;
    rental_id: number;
    user_id: string; // UUID
    start_date: string; // ISO string
    end_date: string; // ISO string
    created_at: string;
    updated_at: string;
}

export default function CalendrierV2() {
    // État pour le mois actuellement affiché
    const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs().startOf('month'));
    
    // État pour stocker les réservations récupérées
    const [reservations, setReservations] = useState<Reservation[]>([]);
    
    // État pour gérer le chargement et les erreurs
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    // État pour stocker les dates sélectionnées par l'utilisateur
    const [selectedDates, setSelectedDates] = useState<dayjs.Dayjs[]>([]);
    
    // État pour afficher les messages d'erreur liés à la sélection
    const [selectionError, setSelectionError] = useState<string | null>(null);

    // Effet pour récupérer les réservations à chaque changement de mois
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setErrorMessage(null);
            try {
                const startOfMonth = currentMonth.startOf('month').toISOString();
                const endOfMonth = currentMonth.endOf('month').toISOString();

                console.log(`Fetching reservations from ${startOfMonth} to ${endOfMonth}`);

                const { data, error } = await supabase
                    .from('reservations') // Nom correct de la table
                    .select('*')
                    .gte('start_date', startOfMonth)
                    .lte('end_date', endOfMonth);

                if (error) {
                    console.error('Erreur lors de la récupération des réservations:', error);
                    setErrorMessage('Impossible de charger les réservations.');
                    return;
                }

                console.log('Réservations récupérées:', data);

                setReservations(data as Reservation[]);
            } catch (error) {
                console.error('Erreur inattendue:', error);
                setErrorMessage('Une erreur inattendue est survenue.');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [currentMonth]);

    // Fonction pour vérifier si une date est réservée
    const isDateReserved = (date: dayjs.Dayjs): boolean => {
        return reservations.some((reservation) =>
            date.isBetween(dayjs(reservation.start_date), dayjs(reservation.end_date), 'day', '[]')
        );
    };

    // Fonction pour vérifier si une date est sélectionnée
    const isDateSelected = (date: dayjs.Dayjs): boolean => {
        if (selectedDates.length === 1) {
            return date.isSame(selectedDates[0], 'day');
        } else if (selectedDates.length === 2) {
            return date.isBetween(selectedDates[0], selectedDates[1], 'day', '[]');
        }
        return false;
    };

    // Fonction pour vérifier s'il y a des dates réservées dans une plage
    const hasReservedDatesInRange = (start: dayjs.Dayjs, end: dayjs.Dayjs): boolean => {
        let current = start;
        while (current.isBefore(end) || current.isSame(end, 'day')) {
            if (isDateReserved(current)) {
                return true;
            }
            current = current.add(1, 'day');
        }
        return false;
    };

    // Gestion du clic sur une date
    const handleDateClick = (day: dayjs.Dayjs): void => {
        // Ne pas permettre la sélection des dates réservées
        if (isDateReserved(day)) return;

        if (selectedDates.length === 0) {
            setSelectedDates([day]);
            setSelectionError(null);
        } else if (selectedDates.length === 1) {
            const firstDate = selectedDates[0];
            const secondDate = day;

            // Déterminer l'ordre des dates
            const start = firstDate.isBefore(secondDate) ? firstDate : secondDate;
            const end = firstDate.isBefore(secondDate) ? secondDate : firstDate;

            // Vérifier s'il y a des dates réservées dans la plage
            if (hasReservedDatesInRange(start, end)) {
                setSelectionError('La plage sélectionnée inclut des dates réservées. Sélectionnez une autre plage.');
                // Réinitialiser la sélection en commençant par la nouvelle date
                setSelectedDates([day]);
            } else {
                setSelectedDates([start, end]);
                setSelectionError(null);
            }
        } else {
            // Si deux dates sont déjà sélectionnées, commencer une nouvelle sélection
            setSelectedDates([day]);
            setSelectionError(null);
        }
    };

    // Génération des jours du calendrier avec mise en forme conditionnelle
    const renderCalendarDays = () => {
        const daysInMonth = currentMonth.daysInMonth();
        const startDayOfWeek = currentMonth.startOf('month').day(); // 0 (Dimanche) à 6 (Samedi)
        const days: JSX.Element[] = [];

        // Remplir les jours vides avant le début du mois
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Remplir les jours du mois
        for (let i = 1; i <= daysInMonth; i++) {
            const day = currentMonth.date(i);
            const reserved = isDateReserved(day);
            const selected = isDateSelected(day);

            days.push(
                <div
                    key={i}
                    onClick={() => handleDateClick(day)}
                    className={`p-2 text-center border cursor-pointer ${
                        reserved
                            ? 'bg-red-500 text-white cursor-not-allowed'
                            : selected
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-black'
                    }`}
                >
                    {day.format('D')}
                </div>
            );
        }

        return days;
    };

    // Gestion de la navigation entre les mois
    const handlePrevMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, 'month'));
    };

    return (
        <div className="max-w-md mx-auto p-4">
            {/* En-tête du calendrier avec navigation */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Mois précédent
                </button>
                <h2 className="text-xl font-semibold">
                    {currentMonth.format('MMMM YYYY')}
                </h2>
                <button
                    onClick={handleNextMonth}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Mois suivant
                </button>
            </div>

            {/* Contenu principal du calendrier */}
            {loading ? (
                <p>Chargement des réservations...</p>
            ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
            ) : (
                <div>
                    {/* Affichage du message d'erreur lié à la sélection */}
                    {selectionError && (
                        <p className="text-red-500 mb-2">{selectionError}</p>
                    )}

                    {/* Grille du calendrier */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* En-têtes des jours de la semaine */}
                        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                            <div key={day} className="text-center font-bold">
                                {day}
                            </div>
                        ))}

                        {/* Jours du mois */}
                        {renderCalendarDays()}
                    </div>

                    {/* Affichage des dates sélectionnées */}
                    {selectedDates.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Dates sélectionnées :</h3>
                            <ul>
                                {selectedDates.map((date, index) => (
                                    <li key={index}>{date.format('YYYY-MM-DD')}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}