'use client' // nécessaire pour utiliser useState/useEffect/onClick, car dans app c'est toujours considéré comme service et pas comme components
import { useState, useEffect, use } from "react"

// le "moule" pour un groupe tel qu'on va l'afficher — juste les champs dont on a besoin ici
type Group = {
    id: string;
    name: string;
    meeting_point: string;
};

// { id: eventId } dans params : Next.js donne l'id de l'URL (ex: /events/UN-ID) sous forme de Promise
export default function EventGroupsPage({ params }: { params: Promise<{ id: string }> }) {
    // use(params) : "déroule" la Promise pour récupérer directement { id } ; renommé "eventId" pour être clair
    const { id: eventId } = use(params);

    // les groupes déjà existants pour cet événement — vide au départ, avant que l'API réponde
    const [groups, setGroups] = useState<Group[]>([]);
    // les 3 champs du formulaire de création, chacun dans sa propre variable (comme sur register/login)
    const [name, setName] = useState("");
    const [meetingPoint, setMeetingPoint] = useState("");
    const [intro, setIntro] = useState("");

    // au chargement de la page (et si eventId change), va chercher les groupes existants
    useEffect(() => {
        fetch(`http://localhost:8080/api/events/${eventId}/groups`)
            .then((reponse) => reponse.json())   // 1er .then : la réponse brute est arrivée
            .then((donnees) => setGroups(donnees)) // 2e .then : les données JSON sont prêtes

    }, [eventId]); // [eventId] au lieu de [] : relance si jamais l'id de l'événement change

    // appelée quand on soumet le formulaire "créer un groupe"
    const handleCreate = async (e: React.SubmitEvent) => {
        e.preventDefault(); // empêche le rechargement de page par défaut du formulaire
        const token = localStorage.getItem('token'); // il faut être connecté pour créer un groupe

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
    // window.prompt() : popup native du navigateur qui demande un texte — rapide à mettre en place
    const introMembre = window.prompt("Écris une phrase pour te présenter :");
    if (!introMembre) return; // si annulé (Cancel), on ne fait rien

    const token = localStorage.getItem('token');

    // on stocke le résultat du fetch dans "reponse" au lieu de l'ignorer — on va l'inspecter juste après
    const reponse = await fetch(`http://localhost:8080/api/groups/${groupId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ intro: introMembre }),
    });

    // reponse.ok : true si le code HTTP est entre 200 et 299 (succès), false sinon (404, 409, 500...)
    // fetch() ne lève PAS d'erreur pour un 404/409 — c'est à nous de vérifier le statut nous-mêmes
    if (!reponse.ok) {
      // si ça a échoué, le backend a répondu avec { error: "..." } (voir groupController.join)
      // reponse.json() lit et décode ce corps de réponse — c'est asynchrone, d'où le "await"
      const erreur = await reponse.json();
      alert("Erreur : " + erreur.error); // on affiche le vrai message du backend, pas un mensonge
      return; // on s'arrête ici, pas de message de succès
    }

    // on arrive ici seulement si reponse.ok était true
    alert("Tu as rejoint le groupe !");
  };


    return (
        <div>
            <h1>Groupes pour cet événement</h1>

            {/* .map() : affiche chaque groupe existant, avec un bouton pour le rejoindre */}
            {groups.map((group) => (
                <div key={group.id}>
                    <h2>{group.name}</h2>
                    <p>{group.meeting_point}</p>
                    <button onClick={() => handleJoin(group.id)}>Rejoindre</button>
                </div>
            ))}

            <h2>Créer un groupe</h2>
            <form onSubmit={handleCreate}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du groupe" />
                <input value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} placeholder="Point de rendez-vous" />
                <input value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="Ta phrase d'accroche" />
                <button type="submit">Créer</button>
            </form>
        </div>
    );
}
