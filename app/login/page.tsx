'use client'

import { useState } from "react"

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const reponse = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Transforme un objet javascript en TEXTE json
            body: JSON.stringify({
                email,
                password,

            }),
        });
        // localStorage = mémoire du navigateur qui survit au rechargement de la page
        // 'token' (1er argument) = la clé qu'on choisit nous-mêmes pour retrouver cette valeur plus tard
        // donnees.token (2e argument) = la vraie valeur, le token renvoyé par l'API login
        const donnees = await reponse.json();
        localStorage.setItem('token', donnees.token);
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