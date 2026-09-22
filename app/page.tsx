import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-12 py-12 sm:flex-row sm:gap-16">
      <div className="max-w-md text-center sm:text-left">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-indigo-950">
          Chaque sortie peut devenir une rencontre.
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          Découvre les événements de Bruxelles, dis que tu veux y aller, et
          rejoins un petit groupe pour y aller ensemble. Le différenciateur
          n&apos;est pas l&apos;agenda — c&apos;est le groupe.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/events"
            className="rounded-md bg-indigo-950 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-900"
          >
            Voir les événements
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-indigo-950 px-6 py-3 text-center text-sm font-semibold text-indigo-950 hover:bg-indigo-50"
          >
            Créer un compte
          </Link>
        </div>
      </div>

      {/* Illustration en SVG pur : aucune image externe, tout fonctionne hors ligne */}
      <svg
        viewBox="0 0 300 300"
        className="h-64 w-64 flex-shrink-0 sm:h-80 sm:w-80"
        aria-hidden="true"
      >
        <circle cx="150" cy="150" r="130" fill="#EEF2FF" />

        {/* le point de rendez-vous, au centre */}
        <path
          d="M150 90 C170 90 185 105 185 125 C185 150 150 190 150 190 C150 190 115 150 115 125 C115 105 130 90 150 90 Z"
          fill="#F96167"
        />
        <circle cx="150" cy="124" r="14" fill="white" />

        {/* les membres du groupe qui convergent vers le point de rendez-vous */}
        <circle cx="70" cy="80" r="16" fill="#2F3C7E" />
        <circle cx="230" cy="90" r="16" fill="#2F3C7E" />
        <circle cx="60" cy="210" r="16" fill="#2F3C7E" />
        <circle cx="235" cy="215" r="16" fill="#2F3C7E" />

        <path d="M78 92 L130 130" stroke="#C7D2FE" strokeWidth="3" strokeDasharray="6 6" />
        <path d="M222 100 L172 130" stroke="#C7D2FE" strokeWidth="3" strokeDasharray="6 6" />
        <path d="M70 198 L128 165" stroke="#C7D2FE" strokeWidth="3" strokeDasharray="6 6" />
        <path d="M225 203 L174 167" stroke="#C7D2FE" strokeWidth="3" strokeDasharray="6 6" />
      </svg>
    </div>
  );
}
