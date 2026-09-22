'use client' // nécessaire pour utiliser useState/useEffect/onClick, car dans app c'est toujours considéré comme service et pas comme components
import { useState, useEffect, use } from "react"

// le "moule" pour un groupe tel qu'on va l'afficher, juste les champs dont on a besoin ici
type Group = {
    id: string;
    name: string;
    meeting_point: string;
    description: string | null; // la phrase d'accroche écrite par l'hôte à la création
    max_participants: number;
    memberCount: number; // calculé côté backend à chaque requête, jamais stocké
};

// le "moule" pour l'événement lui-même : tous les champs nullable existent en base mais
// peuvent être vides selon la source d'ingestion
type EventDetail = {
    id: string;
    title: string;
    description: string | null;
    venue_name: string;
    address: string | null;
    category: string | null;
    starts_at: string;
    image_url: string | null;
    is_free: boolean;
};

// { id: eventId } dans params : Next.js donne l'id de l'URL (ex: /events/UN-ID) sous forme de Promise
export default function EventGroupsPage({ params }: { params: Promise<{ id: string }> }) {
    // use(params) : "déroule" la Promise pour récupérer directement { id } ; renommé "eventId" pour être clair
    const { id: eventId } = use(params);

    const [event, setEvent] = useState<EventDetail | null>(null);
    // les groupes déjà existants pour cet événement, vide au départ, avant que l'API réponde
    const [groups, setGroups] = useState<Group[]>([]);
    // les 3 champs du formulaire de création, chacun dans sa propre variable (comme sur register/login)
    const [name, setName] = useState("");
    const [meetingPoint, setMeetingPoint] = useState("");
    const [intro, setIntro] = useState("");

    // au chargement de la page (et si eventId change), va chercher l'événement ET ses groupes
    useEffect(() => {
        fetch(`http://localhost:8080/api/events/${eventId}`)
            .then((reponse) => reponse.json())
            .then((donnees) => setEvent(donnees));

        fetch(`http://localhost:8080/api/events/${eventId}/groups`)
            .then((reponse) => reponse.json())   // 1er .then : la réponse brute est arrivée
            .then((donnees) => setGroups(donnees)) // 2e .then : les données JSON sont prêtes

    }, [eventId]); // [eventId] au lieu de [] : relance si jamais l'id de l'événement change

    // appelée quand on soumet le formulaire "créer un groupe"
    const handleCreate = async (e: React.SubmitEvent) => {
        e.preventDefault(); // empêche le rechargement de page par défaut du formulaire
        const token = localStorage.getItem('token'); // il faut être connecté pour créer un groupe

        // vérifié côté frontend AVANT d'appeler l'API : message clair plutôt qu'une erreur backend
        if (!token) {
            alert("Il faut se connecter pour pouvoir créer un groupe");
            return;
        }

        await fetch(`http://localhost:8080/api/events/${eventId}/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ name, meeting_point: meetingPoint, intro }),
        });

        // recharge complètement la page, pour revoir la liste à jour avec le nouveau groupe dedans
        window.location.reload();
    };

    // appelée quand on clique "Rejoindre" sur un groupe précis
    const handleJoin = async (groupId: string) => {
        // window.prompt() : popup native du navigateur qui demande un texte, rapide à mettre en place
        const introMembre = window.prompt("Écris une phrase pour te présenter :");
        if (!introMembre) return; // si annulé (Cancel), on ne fait rien

        const token = localStorage.getItem('token');

        // vérifié côté frontend AVANT d'appeler l'API : message clair plutôt qu'une erreur backend
        if (!token) {
            alert("Il faut se connecter pour pouvoir rejoindre un groupe");
            return;
        }

        // on stocke le résultat du fetch dans "reponse" au lieu de l'ignorer, on va l'inspecter juste après
        const reponse = await fetch(`http://localhost:8080/api/groups/${groupId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ intro: introMembre }),
        });

        // reponse.ok : true si le code HTTP est entre 200 et 299 (succès), false sinon (404, 409, 500...)
        // fetch() ne lève PAS d'erreur pour un 404/409, c'est à nous de vérifier le statut nous-mêmes
        if (!reponse.ok) {
            // si ça a échoué, le backend a répondu avec { error: "..." } (voir groupController.join)
            // reponse.json() lit et décode ce corps de réponse, c'est asynchrone, d'où le "await"
            const erreur = await reponse.json();
            alert("Erreur : " + erreur.error); // on affiche le vrai message du backend, pas un mensonge
            return; // on s'arrête ici, pas de message de succès
        }

        // on arrive ici seulement si reponse.ok était true
        alert(`Tu as rejoint le groupe avec le message : "${introMembre}"`);
    };

    // tant que l'événement n'est pas encore arrivé, on affiche un message d'attente
    if (!event) {
        return <p className="text-zinc-500">Chargement...</p>;
    }

    // Intl.DateTimeFormat : API native du navigateur pour formater une date selon une locale précise
    // 'fr-BE' (français de Belgique) donne "vendredi 12 septembre à 20h00" au lieu du format brut ISO
    const dateFormatee = new Intl.DateTimeFormat('fr-BE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(event.starts_at));

    return (
        <div>
            {/* le bandeau : image si dispo, sinon un dégradé de couleur avec le titre en évidence */}
            <div className="relative mb-6 h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-[#F96167] sm:h-72">
                {event.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    {event.category && (
                        <span className="mb-2 inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-950">
                            {event.category}
                        </span>
                    )}
                    <h1 className="text-2xl font-extrabold text-white drop-shadow sm:text-3xl">{event.title}</h1>
                </div>
            </div>

            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-semibold capitalize text-indigo-950">{dateFormatee}</p>
                    <p className="mt-1 text-sm text-zinc-600">
                        {event.venue_name}{event.address ? ` — ${event.address}` : ''}
                    </p>
                    {event.description && (
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-700">{event.description}</p>
                    )}
                </div>
                {event.is_free && (
                    <span className="inline-block flex-shrink-0 rounded-full bg-[#F9E795] px-4 py-1.5 text-xs font-bold text-indigo-950">
                        Gratuit
                    </span>
                )}
            </div>

            <h2 className="mb-4 text-xl font-bold text-indigo-950">Groupes pour cet événement</h2>

            {/* .map() : affiche chaque groupe existant, avec un bouton pour le rejoindre */}
            <div className="mb-8 flex flex-col gap-3">
                {groups.length === 0 && (
                    <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
                        Personne n&apos;a encore créé de groupe. Sois le premier !
                    </p>
                )}
                {groups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <div>
                            <h3 className="font-semibold text-indigo-950">{group.name}</h3>
                            <p className="text-sm text-zinc-600">{group.meeting_point}</p>
                            {group.description && (
                                <p className="mt-1 text-sm italic text-zinc-500">&laquo; {group.description} &raquo;</p>
                            )}
                            <p className="mt-1 text-xs font-semibold text-[#F96167]">{group.memberCount}p / {group.max_participants}max</p>
                        </div>
                        <button
                            onClick={() => handleJoin(group.id)}
                            className="rounded-full bg-indigo-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-900"
                        >
                            Rejoindre
                        </button>
                    </div>
                ))}
            </div>

            <h2 className="mb-3 text-lg font-semibold text-indigo-950">Créer un groupe</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:max-w-md">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom du groupe"
                    className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <input
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                    placeholder="Point de rendez-vous"
                    className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <input
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    placeholder="Ta phrase d'accroche"
                    className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <button type="submit" className="rounded-full bg-[#F96167] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                    Créer
                </button>
            </form>
        </div>
    );
}
