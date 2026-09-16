'use client'

import { useState, useEffect } from "react"

// "type" crée un nom pour une FORME d'objet — pas une vraie valeur, juste une description
// pour TypeScript, qui vérifiera que "user" a toujours exactement cette forme

type UserProfile = {
    email: string;
    display_name: string;
};

export default function ProfilePage() {

    // useState<UserProfile | null> : on dit explicitement à useState "tu vas contenir
    // SOIT un UserProfile (une fois chargé), SOIT null (au départ, rien chargé encore)"
    // sans les < >, TypeScript aurait deviné "toujours null" à partir de l'argument (null)
    // (null) : la valeur de départ, avant que la requête API n'ait répondu
    const [user, setUser] = useState<UserProfile | null>(null);

    // useEffect(fonction, [tableau]) : exécute "fonction" au moment choisi
    // le tableau vide [] veut dire "seulement une fois, quand la page apparaît" —
    // pas à chaque fois que quelque chose change dans le composant
    useEffect(() => {
        // on récupère le token qu'on a stocké lors du login
        const token = localStorage.getItem('token');

        fetch('http://localhost:8080/api/users/me', {
            headers: {
                // le serveur (authMiddleware) attend exactement ce format : "Bearer " + le token
                'Authorization': 'Bearer ' + token,
            },
        })
            .then((reponse) => reponse.json())
            .then((donnees) => setUser(donnees)); // une fois reçu, on stocke dans user → réaffiche la page
    }, []);

    // tant que user est encore null (requête pas terminée), on affiche un message d'attente
    if (!user) {
        return <p>Chargement...</p>;
    }

    return (
        <div>
            <h1>Profil</h1>
            <p>Email : {user.email}</p>
            <p>Nom : {user.display_name}</p>
        </div>
    );
}
