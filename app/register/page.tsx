'use client' // commme les components par défaut dans un fichier app/ est un server component 'use client ' permet de transformer en client component et seuls les clients componenets peuvent utiliser useState, onClick, onChange, ect

import { use, useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [birthdate, setBirthdate] = useState('');

    return (
        <h1>Inscription</h1>
    )
}