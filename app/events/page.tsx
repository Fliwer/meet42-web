// :par défaut, un fichier dans app/ est un "server component," qui ne peut pas utiliser useState, useEffect, onClick... 'use client' le transforme en "client component," le seul type autorisé à utiliser ces hooks et gestionnaires d'événements.
'use client'

import { useState, useEffect } from "react"
import Link from "next/link"


type EventItem = {
    id: string;
    title: string;
    venue_name: string;
    starts_at: string;
    description: string | null; // certains événements importés n'en ont pas

};

export default function EventsPage() {
    // "events" contiendra la liste des événements ; vide au départ, avant que la requête API réponde
    // <EventItem[]> : dit à React "cette variable contiendra un TABLEAU d'objets EventItem"
    // ([]) : la valeur de départ — un tableau vide, avant que l'API ait répondu
    const [events, setEvents] = useState<EventItem[]>([]);

    // useEffect avec [] vide : s'exécute UNE SEULE FOIS, dès que la page apparaît à l'écran
    useEffect(() => {
        // appelle l'API — pas besoin de token ici, contrairement à /profile, les événements sont publics
        fetch('http://localhost:8080/api/events')
            .then((reponse) => reponse.json()) // transforme la réponse en objet JavaScript utilisable
            .then((donnees) => setEvents(donnees)); // stocke les événements reçus → réaffiche la page avec les vraies données
    }, []);

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-indigo-950">Les événements</h1>
            <div className="flex flex-col gap-3">
                {events.map((event) => (
                    <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                    >
                        <h2 className="font-semibold text-indigo-950">{event.title}</h2>
                        <p className="text-sm text-zinc-600">{event.venue_name}</p>
                        <p className="text-sm text-zinc-400">{event.starts_at}</p>
                        {/* line-clamp-2 : coupe le texte après 2 lignes, avec "..." — évite qu'une longue description casse la mise en page */}
                        {event.description && (
                            <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{event.description}</p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}

