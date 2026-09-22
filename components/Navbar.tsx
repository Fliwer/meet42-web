import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="flex items-center gap-6 bg-white border-b border-zinc-200 px-6 py-4">
      <Link href="/" className="mr-auto flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-meet-violet text-sm font-extrabold text-white">42</span>
        <span className="font-display text-lg font-bold tracking-tight text-zinc-900">Meet<span className="text-meet-violet">42</span></span>
      </Link>
      <Link href="/events" className="text-sm font-medium text-zinc-600 hover:text-meet-violet">Événements</Link>
      <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-meet-violet">Connexion</Link>
      <Link href="/register" className="rounded-full bg-meet-violet px-4 py-2 text-sm font-semibold text-white hover:bg-meet-violet-deep">Inscription</Link>
      <Link href="/profile" className="text-sm font-medium text-zinc-600 hover:text-meet-violet">Profil</Link>
    </nav>
  );
}
