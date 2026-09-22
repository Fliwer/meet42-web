'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

const EventsMap = dynamic(() => import("@/components/EventsMap"), { ssr: false });

type EventItem = {
    id: string;
    title: string;
    venue_name: string;
    starts_at: string;
    description: string | null;
    latitude: number;
    longitude: number;
};

export default function Home() {
    const [events, setEvents] = useState<EventItem[]>([]);

        // useEffect avec un tableau vide [] : s'exécute UNE SEULE FOIS, juste après le premier affichage de la page
    useEffect(() => {
        // fetch() envoie une requête GET vers l'API ; il ne renvoie pas la réponse tout de suite,
        // il renvoie une Promise (un "reçu" qui préviendra quand la réponse sera prête)
        fetch('http://localhost:8080/api/events')
            // 1er .then : la réponse HTTP brute est arrivée ; on lui dit de décoder son corps en JSON
            // reponse.json() est LUI-MÊME asynchrone (encore une Promise), d'où le 2e .then juste après
            .then((reponse) => reponse.json())
            // 2e .then : cette fois les vraies données JSON sont prêtes
            // setEvents(donnees) les stocke dans le state → la page se réaffiche avec les vrais événements
            .then((donnees) => setEvents(donnees));
    }, []); // [] vide = ne relance jamais cet effet après le tout premier rendu


    return (
        <div className="-mx-6 -my-8 flex gap-6">
            <div className="hidden w-full max-w-sm flex-shrink-0 pl-6 pt-8 md:block">
                <h1 className="font-display mb-4 text-2xl font-bold text-zinc-900">Sorties à Bruxelles</h1>
                <div className="flex h-[85vh] flex-col gap-3 overflow-y-auto pr-2">
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

            <div className="h-[85vh] flex-1 overflow-hidden rounded-xl border border-zinc-200">
                <EventsMap events={events} />
            </div>
        </div>
    );
}
