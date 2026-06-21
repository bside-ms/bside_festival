import Logo from '@/images/2026/logo_transparent.svg';
import MobileStage from '@/images/2026/wavy_header.svg';
import Image from 'next/image';
import Link from 'next/link';
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

                <div className="mx-auto mt-10 max-w-xl rounded-xl bg-rose-400 p-5 text-center text-sm text-balance text-black">
                    <div className="text-base font-black">Das Festival braucht jetzt deine Unterstützung!</div>
                    <div className="mt-2">
                        Uns ist kurzfristig eine größere Förderung weggebrochen – damit das 10-Jahre-Jubiläum wie geplant stattfinden kann,
                        sind wir auf eure Spenden angewiesen.
                    </div>
                    <Link
                        href="/spenden"
                        className="mt-4 inline-block rounded-full bg-black px-6 py-2 font-black text-white no-underline transition-colors hover:bg-rose-700"
                    >
                        Jetzt spenden
                    </Link>
                </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl min-w-75 px-8 py-5 font-display md:p-8">
                <div className="mx-auto max-w-xl text-center text-sm text-balance">
                    <div className="text-base font-black">Es geht wieder los – und wir feiern 10-jähriges Jubiläum!</div>
                    <div className="mt-2">
                        Am 18. und 19. September verwandeln sich der Stadthafen und das Hansaviertel in Münster in einen Ort für Live-Musik
                        und DJs auf bis zu 7 Bühnen an 5 Locations – dazu Performances, Theater &amp; Kabarett, Lesungen, Vorträge &amp;
                        Poesie, Workshops, Ausstellungen, Familienprogramm, Infostände und vieles mehr.
                    </div>
                </div>

                <div className="mx-auto mt-6 max-w-xl text-center text-sm text-balance">
                    <div className="text-base font-black">Kultur. Hafen. Kante!</div>
                    <div className="mt-2">
                        Unser diesjähriges Motto richtet sich gegen den spürbaren politischen Rechtsruck und steht für Demokratie-Liebe,
                        gelebte Diversität und soziale Gerechtigkeit. Das B-Side Festival ist ein Ort des Mitmachens, der Zusammenarbeit und
                        der Vielfalt – ein Raum für Kultur, Bildung und Austausch, den wir gemeinsam von unten nach oben gestalten.
                    </div>
                    <div className="mt-2">
                        Seit der ersten Ausgabe 2016 organisiert ein ehrenamtliches Kollektiv das Non-Profit-Festival als Gegenpol zu
                        kommerziellen Musikveranstaltungen. Der Zugang ist und bleibt kostenfrei – damit alle Menschen unabhängig von ihrem
                        Einkommen dabei sein können. Jede*r ist willkommen!
                    </div>
                </div>

                <div className="mx-auto mt-6 max-w-xl text-center text-sm text-balance">
                    <div className="mt-4 space-x-1">
                        <span className="font-black">Wann?</span> <span>18.–19. September 2026</span>
                    </div>
                    <div className="mt-4 space-x-1">
                        <span className="font-black">Wo?</span> <span>Mittelhafen &amp; Hansaviertel Münster</span>
                    </div>
                </div>

                <div className="mx-auto mt-8 max-w-xl rounded-xl border-2 border-black p-4 text-center text-sm text-balance">
                    <div className="text-base font-black">Info für Künstler*innen</div>
                    <div className="mt-2">
                        Die Bewerbungsphase ist beendet – und wir sind überwältigt von den vielen spannenden Bewerbungen. Gerade sitzen wir
                        auf Hochtouren an der Kuration des Programms und schauen uns alle Beiträge sorgfältig an. Mit einer Rückmeldung von
                        uns ist im Juli zu rechnen.
                    </div>
                    <div className="mt-2">
                        Bitte schickt uns keine weiteren Bewerbungen per Mail, Instagram oder auf anderen Wegen – Nachzügler:innen können
                        wir leider nicht mehr berücksichtigen. Danke für all die Zeit, Mühe und das Vertrauen, die in eure Bewerbungen
                        geflossen sind!
                    </div>
                </div>
            </div>
        </>
    );
};
