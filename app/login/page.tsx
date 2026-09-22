'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

        const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const reponse = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const donnees = await reponse.json();

        // même principe que dans handleJoin : reponse.ok distingue succès (200-299) et échec (401 ici)
        if (!reponse.ok) {
            alert("Erreur : " + donnees.error);
            return; // on ne stocke rien, on ne redirige pas
        }

        localStorage.setItem('token', donnees.token);
        router.push('/profile');
    };


    return (

        <form onSubmit={handleSubmit} className="mx-auto flex max-w-sm flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">

            <h1 className="mb-2 text-xl font-bold text-indigo-950">Connexion</h1>

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
            <button type="submit" className="rounded-md bg-indigo-950 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-900">Se connecter</button>

        </form>

    );
}