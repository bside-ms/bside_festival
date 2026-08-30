import { confirmVolunteerEmail } from '@/lib/actions/volunteerActions';
import type { ReactElement } from 'react';

export default async ({ params }: { params: Promise<{ token: string }> }): Promise<ReactElement> => {
    const { token } = await params;

    const result = await confirmVolunteerEmail(token);

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-2xl px-5 pt-8 pb-12 md:px-8">
            {result.success ? (
                <div className="flex w-full flex-col gap-6">
                    <div className="font-display text-4xl font-bold">Anmeldung bestätigt</div>
                    <p className="leading-relaxed">
                        Super, deine E-Mail-Adresse ist bestätigt. Du bist jetzt als Helfer*in für das B-Side Festival registriert. Die
                        Infos zum Engelsystem und zu den Treffen wurden dir gerade per E-Mail geschickt. Schau gegebenenfalls auch im
                        Spam-Ordner nach.
                    </p>
                </div>
            ) : (
                <div className="flex w-full flex-col gap-6">
                    <div className="font-display text-4xl font-bold">Bestätigung fehlgeschlagen</div>
                    <div className="text-red-600">{result.message}</div>
                </div>
            )}
        </div>
    );
};
