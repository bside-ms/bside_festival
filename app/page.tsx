import Logo from '@/images/2026/logo_transparent.svg';
import MobileStage from '@/images/2026/wavy_header.svg';
import Image from 'next/image';
import { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    return (
        <>
            <Image src={MobileStage} alt="Festival-Logo" className="absolute top-43.75 -z-1 w-screen sm:hidden" />

            <div className="relative mx-auto w-full max-w-2xl min-w-75 px-8 py-5 font-display md:p-8">
                <Image src={Logo} alt="Festival-Logo" className="mx-auto w-37.5 sm:w-62.5" />

                <div className="flex flex-col items-center pt-34 sm:pt-12">18.-19. September 2026</div>
                <div className="mt-6 flex flex-col items-center px-4 text-center text-4xl font-black sm:text-6xl">
                    <div>Dein Projekt.</div>
                    <div>Unsere Bühne.</div>
                    <div>B-Side Festival ruft.</div>
                </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl min-w-75 px-8 py-5 font-display md:p-8">
                <div className="mx-6 mt-4 text-center">
                    <div className="text-base font-black text-balance">Die Bewerbungsphase für das B-Side Festival 2026 ist beendet.</div>
                    <div className="text-xs">
                        Wir sind ehrlich überwältigt davon, wie viele Menschen Lust haben, dieses Festival mitzugestalten.
                    </div>
                </div>

                <div className="mx-auto max-w-xl text-center text-xs text-balance">
                    <div>
                        <div className="mt-4">
                            <span className="text-base font-black">Wann?</span> 18.–19. September 2026
                        </div>
                        <div className="mt-4">
                            <span className="text-base font-black">Wo?</span> Mittelhafen & Hansaviertel Münster
                        </div>
                        <div className="mt-4">
                            <div className="text-base font-black">Wie geht es weiter?</div>
                            <div className="mt-2">
                                Wir gehen gerade durch eure Bewerbungen, lesen, hören, schauen, sortieren und sind ziemlich sprachlos, wie
                                viel Liebe, Herz und gute Ideen bei uns gelandet sind. Danke für all die Zeit, Gedanken und Energie, die
                                ihr da reingegeben habt.
                            </div>
                            <div className="mt-2">
                                Bitte schickt uns keine weiteren Bewerbungen per Mail, Instagram oder auf anderen Wegen. Wir können
                                Nachzügler:innen leider nicht mehr berücksichtigen und möchten uns jetzt fair und konzentriert um alles
                                kümmern, was rechtzeitig angekommen ist.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
