import Link from "next/link"

// Ce composant n'est écrit qu'UNE FOIS ici, mais s'affiche sur TOUTES les pages du site :
// il est posé une seule fois dans app/layout.tsx, le cadre commun à toutes les pages.
export default function Navbar() {
  return (
    <nav className="flex items-center gap-6 bg-white border-b border-zinc-200 px-10 py-4">
      {/* le logo : mr-auto le pousse tout à gauche, en poussant tous les liens suivants à droite */}
      <Link href="/" className="mr-auto flex items-center gap-2">
        {/* border-2 border-meet-violet + text-meet-violet = contour violet sur fond blanc
            (au lieu d'un fond violet plein) — un style "badge" plutôt que "bouton" */}
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-meet-violet text-sm font-extrabold text-meet-violet">42</span>
        <span className="font-display text-lg font-bold tracking-tight text-zinc-900">Meet<span className="text-meet-violet">42</span></span>
      </Link>
      <Link href="/events" className="text-sm font-medium text-zinc-600 hover:text-meet-violet">Événements</Link>
      <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-meet-violet">Connexion</Link>
      {/* Inscription est le seul stylé comme un vrai bouton (fond plein, coins très arrondis) :
          c'est l'action qu'on veut le plus encourager visuellement */}
      <Link href="/register" className="rounded-full bg-meet-violet px-4 py-2 text-sm font-semibold text-white hover:bg-meet-violet-deep">Inscription</Link>
      <Link href="/profile" className="text-sm font-medium text-zinc-600 hover:text-meet-violet">Profil</Link>
    </nav>
  );
}
