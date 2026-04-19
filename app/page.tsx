import Logo from '@/images/2026/logo_transparent.svg';
import MobileStage from '@/images/2026/wavy_header.svg';
import isWithinApplicationPhase from '@/lib/common/helper/withinApplicationPhase';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    return (
        <>
            <Image src={MobileStage} alt="Festival-Logo" className="absolute top-[175px] -z-1 w-screen sm:hidden" />

            <div className="relative mx-auto w-full max-w-2xl min-w-[300px] p-5 font-display md:p-8">
                {/* Top Part */}
                <Image src={Logo} alt="Festival-Logo" className="mx-auto w-[150px] sm:w-[250px]" />

                <div className="flex flex-col items-center pt-4">18.-19. September 2026</div>
                <div className="mt-6 flex flex-col items-center text-center text-4xl font-black sm:text-6xl">
                    <div>Dein Projekt.</div>
                    <div>Unsere Bühne.</div>
                    <div>B-Side Festival ruft.</div>
                </div>

                <div className="mx-6 mt-4 text-center">
                    <div className="text-base font-black">
                        Du machst Musik, Kunst oder hast ein Projekt, das gesehen und gehört werden sollte?
                    </div>
                    <div className="text-xs">
                        <span className="text-red-500">→</span> Dann bewirb dich jetzt für das B‑Side Festival 2026!
                    </div>
                </div>

                {/* Middle Part */}
                <div className="grid grid-cols-1 text-center md:grid-cols-5 md:text-left">
                    <div className="col-span-2 flex flex-col items-center justify-center">
                        {isWithinApplicationPhase() && (
                            <Link
                                href="/bewerbungen"
                                className="m-5 flex aspect-square w-40 flex-col items-center justify-center rounded-full bg-black text-center text-xl leading-tight font-black text-[#d682b5] shadow-lg transition-all duration-300 hover:scale-105 hover:text-white"
                            >
                                <span>HIER</span>
                                <span>BEWERBEN</span>
                            </Link>
                        )}
                    </div>

                    <div className="col-span-3 text-xs">
                        <div className="mt-4">
                            <span className="text-base font-black">Wann?</span> 18.–19. September 2026
                        </div>
                        <div className="mt-4">
                            <span className="text-base font-black">Wo?</span> Mittelhafen & Hansaviertel Münster
                        </div>
                        <div className="mt-4">
                            <span className="text-base font-black">Wen suchen wir?</span> Bands, Musiker:innen, Künstler:innen,
                            Workshopgeber:innen, Speaker:innen, FLINTA*-Acts und Menschen aus allen Lebensrealitäten – mit frischen
                            Perspektiven und neuen Ideen
                            <div className="mt-2">
                                Ob professionell oder aus Leidenschaft – all welcome. Egal ob Bühne, Raum, Installation oder etwas ganz
                                anderes: Wir sind gespannt auf das, was wir noch nicht kennen.
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="text-sm font-black">Bewerbungszeitraum</div>
                            <div className="text-xl">
                                <span className="mr-1 text-red-500">→</span>19. April bis 10. Mai
                            </div>
                        </div>

                        {/* 
                    <div className='mt-4'>
                        <div className="font-black text-base">Über das Festival</div>
                        <div>Das B‑Side Festival findet am 18.–19. September 2026 rund um den Mittelhafen und im Hansaviertel Münster statt. Dich erwartet ein vielfältiges, offenes Kulturprogramm in entspannter Hafenatmosphäre.</div>
                    </div> */}
                    </div>
                </div>

                {/* Bottom Part */}
                <div className="my-4 text-center text-base">
                    Fragen zur Bewerbung?
                    <div>
                        Schreib uns gerne an:{' '}
                        <Link className="underline" href="mailto:festival@b-side.ms">
                            festival@b-side.ms
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};
