"use client";

import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs'; // Importer dayjs et son type pour manipuler les dates
import 'dayjs/locale/fr'; // Importer la localisation française pour dayjs
import 'tailwindcss/tailwind.css'; // Importer Tailwind CSS pour la mise en forme

dayjs.locale('fr'); // Configurer dayjs pour utiliser la localisation française

const Calendar: React.FC = () => {
    // État pour la date actuelle du calendrier (mois affiché) et pour les dates sélectionnées (début et fin)
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    // Déterminer le début et la fin du mois actuel
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    // Déterminer la semaine complète couvrant ce mois, en commençant par le début de la semaine du premier jour du mois
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');

    // Créer un tableau de jours à afficher dans le calendrier
    const days = [];
    let day = startOfWeek;

    // Ajouter tous les jours entre startOfWeek et endOfWeek au tableau `days`
    while (day.isBefore(endOfWeek, 'day')) {
        days.push(day);
        day = day.add(1, 'day'); // Avancer au jour suivant
    }

    // Fonction pour passer au mois précédent
    const handlePrevMonth = () => {
        setCurrentDate(currentDate.subtract(1, 'month'));
    };

    // Fonction pour passer au mois suivant
    const handleNextMonth = () => {
        setCurrentDate(currentDate.add(1, 'month'));
    };

    // Gestion de la sélection des dates : Si aucune date ou une plage de dates complète est déjà sélectionnée, redémarre la sélection. Sinon, sélectionne une plage.
    const handleDateClick = (clickedDay: Dayjs) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(clickedDay); // Démarrer une nouvelle sélection
            setEndDate(null); // Réinitialiser la fin
        } else if (startDate && !endDate) {
            // Si on a déjà une date de début, définir une plage en fonction de la date cliquée
            if (clickedDay.isBefore(startDate)) {
                setStartDate(clickedDay); // Remplace la date de début si la nouvelle date est antérieure
            } else {
                setEndDate(clickedDay); // Sinon, définir la fin de la plage
            }
        }
    };

    // Fonction pour vérifier si un jour est compris dans la plage de dates sélectionnée
    const isInRange = (day: Dayjs) => {
        if (startDate && endDate) {
            return day.isAfter(startDate) && day.isBefore(endDate);
        }
        return false;
    };

    // Fonction pour vérifier si un jour est la date de début ou de fin sélectionnée
    const isSelected = (day: Dayjs) => {
        return day.isSame(startDate, 'day') || day.isSame(endDate, 'day');
    };
    
    return (
        <div className="p-4 max-w-md mx-auto bg-primary border border-gray-800 rounded-lg shadow-md">
            {/* Affichage des dates de début et de fin sélectionnées */}
            <div className="mb-4">
                <h3 className="text-lg font-bold">Dates de réservation</h3>
                {/* Si les dates sont sélectionnées, elles sont affichées ; sinon, afficher un format vide */}
                <p>Du: {startDate ? startDate.format('DD/MM/YYYY') : '../../....'} Au: {endDate ? endDate.format('DD/MM/YYYY') : '../../....'}</p>
            </div>
            
            {/* En-tête du calendrier avec la navigation pour changer de mois */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    {/* Affichage du mois et de l'année en cours, en capitalisant la première lettre du mois */}
                    {currentDate.format('MMMM YYYY').charAt(0).toUpperCase() + currentDate.format('MMMM YYYY').slice(1)}
                </h2>
                <div className="ml-auto flex space-x-2">
                    {/* Boutons pour passer au mois précédent ou suivant */}
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
   
                    {/* Affichage des jours dans la grille */}
                    {days.map((day) => (
                        <div
                            key={day.toString()}
                            // Styliser les jours en fonction du mois, de la sélection et de la plage
                            className={`text-center p-0 cursor-pointer w-100% h-12 flex items-center justify-center font-bold ${day.month() !== currentDate.month() ? 'text-gray-400' : ''} ${isSelected(day) ? 'bg-secondary text-accent rounded-full' : ''} ${isInRange(day) ? 'bg-gray-700 rounded' : ''} hover:bg-secondary`}
                            // Quand un jour est cliqué, la fonction de sélection est appelée
                            onClick={() => handleDateClick(day)}
                        >
                            {day.date()} {/* Afficher la date du jour */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;