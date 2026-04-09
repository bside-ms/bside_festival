'use client';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <div className="font-display text-xl uppercase">Fehler beim Laden der Bewerbungen.</div>
        <div className="text-sm text-gray-500">{error.message}</div>
        <button onClick={reset} className="bg-black px-4 py-2 font-display text-white">
            Erneut versuchen
        </button>
    </div>
);

export default Error;
