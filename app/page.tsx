import ApplyNow from '@/images/2026/application_form.svg';
import Logo from '@/images/2026/logo_transparent.svg';
import { isWithinInterval } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    const applicationStart = new Date('2026-04-19');
    const applicationEnd = new Date('2026-05-10');

    return (
        <div className="relative mx-auto w-full max-w-2xl min-w-[300px] px-4 pt-2 font-display md:px-0">
            {/* Top Part */}
            <Image src={Logo} alt="Festival-Logo" className="mx-auto w-[150px] sm:w-[250px]" />

            <div className="flex flex-col items-center">18.-19. September 2026</div>
            <div className="mt-10 flex flex-col items-center text-4xl font-black sm:text-6xl">Sei dabei!</div>

            {/* Middle Part */}
            <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="col-span-2 flex flex-col items-center justify-center">
                    {isWithinInterval(new Date(), { start: applicationStart, end: applicationEnd }) && (
                        <Image src={ApplyNow} alt="Jetzt Bewerben" className="m-5 mt-0 w-[125px]" />
                    )}

                    <div className="text-4xl font-black">Dein Sound.</div>
                    <div className="text-4xl font-black">Unsere Bühne.</div>
                    <div className="text-4xl font-black">B-Side ruft.</div>
                </div>

                <div className="col-span-3 text-xs">
                    <div className="mt-4">
                        <div className="text-sm font-black">Bewirb dich fürs B‑Side Festival 2026</div>
                        <div>
                            Du machst Musik und möchtest Teil des B‑Side Festivals werden? Dann bist du hier genau richtig. Wir suchen Acts,
                            die Lust haben, das Festival mitzugestalten.
                        </div>
                    </div>

                    <div className="mt-4">
                        Bewirb dich vom <span className="text-sm font-black">19. April bis 10. Mai </span> über unser&nbsp;
                        {isWithinInterval(new Date(), { start: applicationStart, end: applicationEnd }) ? (
                            <Link href="/application" className="underline">
                                Online-Formular
                            </Link>
                        ) : (
                            <span>Online-Formular</span>
                        )}
                    </div>

                    <div className="mt-4">
                        <div className="text-sm font-black">Wer kann sich bewerben?</div>
                        <div>
                            Grundsätzlich alle. Egal ob Band, Solo‑Projekt, Newcomer oder erfahrene Acts. Besonders freuen wir uns über
                            Bewerbungen von FLINTA*‑Personen und von Menschen aus marginalisierten Gruppen.
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="text-sm font-black">Was wir suchen</div>
                        <div>
                            Musik, die bewegt – ob laut, leise, experimentell oder tanzbar. Wichtig ist, dass dein Projekt zum offenen,
                            solidarischen und nicht-kommerziellen Charakter des B‑Side Festivals passt.
                        </div>
                    </div>
                    {/* 
                    <div className='mt-4'>
                        <div className="font-black text-sm">Über das Festival</div>
                        <div>Das B‑Side Festival findet am 18.–19. September 2026 rund um den Mittelhafen und im Hansaviertel Münster statt. Dich erwartet ein vielfältiges, offenes Kulturprogramm in entspannter Hafenatmosphäre.</div>
                    </div> */}
                </div>
            </div>

            {/* Bottom Part */}
            <div className="my-4 text-center text-sm">
                Fragen zur Bewerbung? Schreib uns gerne an:{' '}
                <Link className="underline" href="mailto:festival@b-side.ms">
                    festival@b-side.ms
                </Link>
            </div>
        </div>
    );
};
