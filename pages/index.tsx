import Image from 'next/image';
import type { ReactElement } from 'react';
import BHeartLinesSvg from 'components/common/BHeartLinesSvg';
import Footer from 'components/common/Footer';

export default (): ReactElement => {
    return (
        <div>
            <div className="relative min-h-screen w-full font-display">
                <div className="relative z-10">
                    <div className="flex">
                        <div className="relative min-h-max w-1/4 max-w-[385px] sm:w-2/5">
                            <div className="absolute w-full min-w-[200px]">
                                <div className="relative aspect-square w-full">
                                    <Image
                                        src="/assets/frontpage-heart-red.webp"
                                        alt="Eyecatcher"
                                        fill={true}
                                        className="object-contain object-left"
                                    />
                                </div>
                                <div className="relative -mt-4 hidden aspect-square w-full sm:block">
                                    <BHeartLinesSvg color="#000" />
                                </div>
                                <div className="relative -mt-2 aspect-square w-full sm:hidden">
                                    <BHeartLinesSvg color="#888" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-14 flex max-w-[540px] pr-7 pt-16 sm:pl-5 sm:pr-10 sm:pt-24">
                            <div className="relative mb-[70rem] md:mb-[60rem]">
                                <div className="text-4xl font-semibold [text-align-last:justify] sm:text-5xl md:text-6xl">B - S i d e</div>
                                <div className="text-4xl font-semibold [text-align-last:justify] sm:text-5xl md:text-6xl">
                                    F e s t i v a l
                                </div>
                                <div className="text-xl [text-align-last:justify] sm:text-3xl">2 0 2 4</div>

                                <div className="absolute inset-x-0 top-full flex flex-col">
                                    <div className="mt-8 text-justify text-xl">
                                        Es geht wieder los: Das 8. B-Side Festival steht vor der Tür!
                                    </div>
                                    <div className="mt-2 text-justify text-xl">…und diesmal sogar vor neuen Türen:</div>

                                    <div className="mt-3 text-justify text-xs">
                                        Nachdem wir im letzten Jahr noch in unserer Zwischennutzung am Hawerkamp zu finden waren, freuen wir
                                        uns in diesem Jahr besonders den Hill-Speicher am Hafen wieder mit neuem Leben zu füllen. Vom 20.
                                        bis 21.09.2024 weihen wir das frisch renovierte Gebäude mit Kunst, Musik, Literatur und Workshops
                                        ein.
                                    </div>
                                    <div className="mt-20 text-justify text-lg sm:text-2xl">Bewerbungsphase beendet</div>

                                    <div className="mt-3 text-justify text-xs">
                                        Die diesjährige Bewerbungsphase ist beendet. Und wir sind überwältigt von den unzähligen
                                        wundervollen Bewerbungen! Nun stecken wir die Köpfe zusammen, um für euch ein unterhaltsames und
                                        diverses Programm für das diesjährige B-Side Festival zusammenzustellen. Wir halten euch hier und in
                                        den sozialen Medien auf dem Laufenden!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Image src="/assets/background.webp" alt="Hintergrund" className="absolute z-0 object-cover object-top" fill={true} />
            </div>

            <Footer />
        </div>
    );
};
