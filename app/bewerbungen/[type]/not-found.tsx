import Link from 'next/link';

const NotFound = () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <div className="font-display text-xl uppercase">Bewerbungstyp nicht gefunden.</div>
        <Link href="/bewerbungen" className="bg-black px-4 py-2 font-display text-white">
            Zurück zur Übersicht
        </Link>
    </div>
);

export default NotFound;
