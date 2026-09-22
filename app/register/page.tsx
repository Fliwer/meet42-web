'use client' // commme les components par défaut dans un fichier app/ est un server component 'use client ' permet de transformer en client component et seuls les clients componenets peuvent utiliser useState, onClick, onChange, ect

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
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

        // même principe que sur login : reponse.ok distingue succès (201) et échec (400, 409...)
        if (!reponse.ok) {
            alert("Erreur : " + donnees.error);
            return;
        }

        alert("Compte créé ! Connecte-toi maintenant.");
        router.push('/login');
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-sm flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-xl font-bold text-indigo-950">Inscription</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
            <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Prénom"
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
            <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />

            <button type="submit" className="rounded-md bg-indigo-950 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-900">S'inscrire</button>

        </form>
    );




}
