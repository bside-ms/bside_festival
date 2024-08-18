import { ReactElement, useRef, useState } from 'react';
import Footer from 'components/common/Footer';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import { range } from 'lodash';
import cn from 'lib/common/helper/cn';
import Link from 'next/link';

const lastImage = 22;

export default (): ReactElement => {
    const [currentBgImage, setCurrentBgImage] = useState(2);

    const intervalId = useRef<number>();

    useEffectOnMount(() => {
        intervalId.current = window.setInterval(() => {
            setCurrentBgImage((prevState) => {
                if (prevState === lastImage) {
                    window.clearInterval(intervalId.current);
                    return lastImage;
                }

                return prevState + 2;
            });
        }, 500);
    });

    return (
        <div>
            <div className="relative mx-auto min-h-screen w-full max-w-2xl font-display">
                <div className="py-3 text-center font-bold uppercase tracking-[0.3em] text-[#5ff450]">20. & 21. September 2024</div>

                <div className="h-10 w-full bg-black" />

                <div className="relative h-96 overflow-hidden md:h-[580px]">
                    {range(2, lastImage + 1, 2).map((bgImage) => (
                        <div
                            key={`bg${bgImage}`}
                            className={cn(
                                'absolute h-full w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cover bg-center bg-no-repeat opacity-0',
                                currentBgImage === bgImage && 'opacity-100',
                            )}
                            style={{
                                backgroundImage: `url("/assets/2024-animation/animation${bgImage.toString().padStart(2, '0')}.png")`,
                            }}
                        />
                    ))}
                </div>

                <div className="py-3 text-center">
                    <div className="font-bold uppercase tracking-[0.3em] text-[#5ff450]">Spielplatz für Kreative</div>
                    <div className="text-xs text-black">Veranstaltet vom B-Side Kultur e.V.</div>
                </div>

                <div className="h-5 w-full bg-black" />

                <Link
                    className="block w-full cursor-pointer select-none bg-[#FDF85D] py-3 text-center font-bold uppercase tracking-[0.3em] text-[#FEC7DB]"
                    href="/programm"
                >
                    zum Programm {'>>'}
                </Link>

                <div className="h-5 w-full bg-[#5ff450]" />

                <div className="px-5 py-3 text-left">
                    <div className="font-bold uppercase tracking-[0.3em] text-black">Welcome back</div>

                    <div className="pt-3 text-xs text-black">
                        Festival 2024 feiern wir dieses Jahr unter dem Motto „Spielplatz für Kreative“ die kulturelle Eröffnung der B-Side.
                        Vom 20. bis zum 21. September bietet der B-Side Kultur e.V. ein vielfältiges Angebot aus Musik, Ausstellungen,
                        Performances, Workshops, Lesungen uvm. Alle Menschen sind herzlich eingeladen, an dem bunten, nicht kommerziellen
                        Programm teilzunehmen, es mitzugestalten und das neue soziokulturelle Zentrum zu erkunden. Für Interessierte an den
                        gemeinnützigen Projekten des B-Side Kollektivs sind außerdem Infostände und eine Ausstellung über die
                        B-Side-Geschichte geplant. Das Festival findet dieses Jahr vor allem in den frisch renovierten Räumlichkeiten Am
                        Mittelhafen 42 statt, die anschließende Party ist wie in den Vorjahren in der Sputnikhalle geplant. Um all das zu
                        realisieren, engagieren sich aktuell über 20 Menschen ehrenamtlich, kollektiv und selbstorganisiert im Festival-Team
                        des B-Side Kultur e.V.
                    </div>
                </div>

                <div className="h-5 w-full bg-black" />
                <div className="h-5 w-full bg-[#FEC7DB]" />

                <div className="px-5 py-3 text-left">
                    <div className="font-bold uppercase tracking-[0.3em] text-black">Mithelfen</div>

                    <div className="pt-3 text-xs text-black">
                        Für unser B-Side Festival 2024 brauchen wir euch! Wir suchen tatkräftige Helfer*innen. Dabei gibt es verschiedene
                        Aufgaben, bei denen ihr euch einbringen könnt: Die Betreuung von Konzerten, Workshops, Ausstellungen und Lesungen,
                        die Verpflegung für das Helfer*innen- und B-Side-Team, Hilfe beim Auf- und Abbau und der Technik des Festivals,
                        Unterstützung des Awareness-Teams auf dem gesamten Festival und beim Spendensammeln.
                    </div>

                    <a
                        className="mt-4 block w-full cursor-pointer select-none bg-[#FEC7DB] py-3 text-center text-sm font-bold uppercase tracking-[0.3em] text-[#FDF85D]"
                        href="/mithelfen"
                    >
                        zum Anmeldeformular {'>>'}
                    </a>
                </div>

                <div className="h-10 w-full bg-[#5ff450]" />

                <Footer />
            </div>
        </div>
    );
};
