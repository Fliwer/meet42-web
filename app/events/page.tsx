'use client'

import { useState, useEffect } from "react"
import Link from "next/link"

type EventItem = {
    id: string;
    title: string;
    venue_name: string;
    starts_at: string;
    description: string | null;
};

export default function EventsPage() {
    const [events, setEvents] = useState<EventItem[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/events')
            .then((reponse) => reponse.json())
            .then((donnees) => setEvents(donnees));
    }, []);

    return (
        // Cette page n'affiche PAS de carte, volontairement — c'est la version "liste seule",
        // en grille responsive. La carte + liste ensemble, c'est app/page.tsx (l'accueil).
        <div>
            <h1 className="font-display mb-6 text-2xl font-bold text-zinc-900">Toutes les sorties</h1>
            {/* grid-cols-1 (mobile) → sm:grid-cols-2 → lg:grid-cols-3 :
                le nombre de colonnes s'adapte à la largeur d'écran, sans code JS, juste du CSS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-meet-violet hover:shadow-md"
                    >
                        <h2 className="font-semibold text-zinc-900">{event.title}</h2>
                        <p className="text-sm text-zinc-600">{event.venue_name}</p>
                        <p className="text-sm text-zinc-400">{event.starts_at}</p>
                        {event.description && (
                            <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{event.description}</p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
