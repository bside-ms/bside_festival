import ApplicationTypeSelection from '@/components/applications/applicationForm/ApplicationTypeSelection';
import BackgroundImage from '@/components/common/BackgroundImage';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';
import { IoWarning } from 'react-icons/io5';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    return (
        <div className="relative min-h-screen w-full">
            <div className="relative z-10">
                <div className="mx-auto w-full max-w-[700px] p-5 drop-shadow-xl md:w-2/3 md:p-8">
                    <Link href="/" className="flex items-center gap-3 text-red-600">
                        <div className="pt-1 text-2xl md:pt-2 md:text-3xl">B-Side Festival 2025</div>
                    </Link>

                    <div className="flex w-full flex-col gap-6">
                        <div className="font-display text-4xl font-bold text-white">B-werbung</div>

                        <div className="text-white">
                            Auf dem B-Side Festival gibt es viele verschiedene Möglichkeiten, sich einzubringen. Damit wir den Überblick
                            behalten, haben wir auf dieser Seite verschiedene Bewerbungsformulare zusammengestellt. Such dir einfach das
                            Genre aus, das am Besten zu deinem Programmpunkt passt.
                        </div>

                        <div className="rounded-md bg-yellow-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <IoWarning className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Hinweis</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            Die reguläre Bewerbungsphase ist bereits abgeschlossen. Diese Formulare stehen nur noch für
                                            manuelle Nachträge zur Verfügung.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ApplicationTypeSelection />
                    </div>
                </div>
            </div>

            <BackgroundImage />
        </div>
    );
};
