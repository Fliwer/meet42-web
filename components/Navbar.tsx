import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="flex items-center gap-6 bg-indigo-950 px-6 py-4 text-white">
      <Link href="/" className="mr-auto flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F96167] text-sm font-extrabold text-white">42</span>
        <span className="text-lg font-bold tracking-tight text-white">Meet<span className="text-[#F96167]">42</span></span>
      </Link>
      <Link href="/events" className="text-sm font-medium text-indigo-100 hover:text-white">Événements</Link>
      <Link href="/login" className="text-sm font-medium text-indigo-100 hover:text-white">Connexion</Link>
      <Link href="/register" className="text-sm font-medium text-indigo-100 hover:text-white">Inscription</Link>
      <Link href="/profile" className="text-sm font-medium text-indigo-100 hover:text-white">Profil</Link>
    </nav>
  );
}
