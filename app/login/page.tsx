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

        <form onSubmit={handleSubmit}>
            
            <h1>Connexion</h1>

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
            <button type="submit">Se connecter</button>

        </form>

    );
}