'use client' // commme les components par défaut dans un fichier app/ est un server component 'use client ' permet de transformer en client component et seuls les clients componenets peuvent utiliser useState, onClick, onChange, ect

import { useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [birthDate, setBirthDate] = useState('');

    // React.SubmitEvent = le type de l'événement "soumission de formulaire"
    // (React.FormEvent est déconseillé/déprécié dans cette version : "n'existe pas vraiment")
    // e contient les infos sur cet événement précis (ici : la soumission)
    
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const reponse = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Transforme un objet javascript en TEXTE json
            body: JSON.stringify({
                email,
                password,
                display_name: displayName,
                birth_date: birthDate,
            }),
        });

        const donnees = await reponse.json();
        console.log(donnees);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Inscription</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
            />
            <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Prénom"
            />
            <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
            />

            <button type="submit">S'inscrire</button>

        </form>
    );




}
