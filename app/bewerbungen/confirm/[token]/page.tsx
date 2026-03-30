import type { ReactElement } from 'react';
import { checkVerification } from '@/lib/actions/emailConfirmationActions';


export default async ({ params }: { params: Promise<{ token: string }> }): Promise<ReactElement> => {
    const { token } = await params;

    const result = await checkVerification(token);

    return (
        <div className="relative min-h-screen w-full">
            <div className="relative z-10">
                <div className="mx-auto w-full max-w-[700px] p-5 drop-shadow-xl md:w-2/3 md:p-8">
                    {result.success ? (
                        <div className="flex w-full flex-col gap-6">
                            <div className="font-display text-4xl font-bold">B-werbung abgeschlossen</div>
                            <div>Verifikation erfolgreich! Deine Bewerbung ist nun vollständig abgeschlossen.</div>
                            {result.message && <div className="text-green-500">{result.message}</div>}
                        </div>
                    ) : (
                        <div className="flex w-full flex-col gap-6">
                            <div className="text-red-500">Verifikation fehlgeschlagen: {result.message}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
