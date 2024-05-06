import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import BHeartLinesSvg from 'components/common/BHeartLinesSvg';
import Footer from 'components/common/Footer';

export default (): ReactElement => {
    const { status } = useSession();

    return (
        <div>
            <div className="min-h-screen w-full relative font-display">
                <div className="relative z-10">
                    <div className="flex">
                        <div className="w-1/3 sm:w-2/5 relative max-w-[385px] min-h-max">
                            <div className="absolute w-full min-w-[200px]">
                                <div className="relative w-full aspect-square">
                                    <Image
                                        src="/assets/frontpage-heart-red.webp"
                                        alt="Eyecatcher"
                                        fill={true}
                                        className="object-contain object-left"
                                    />
                                </div>
                                <div className="hidden sm:block relative w-full aspect-square -mt-4">
                                    <BHeartLinesSvg color="#000" />
                                </div>
                                <div className="sm:hidden relative w-full aspect-square -mt-2">
                                    <BHeartLinesSvg color="#888" />
                                </div>
                            </div>
                        </div>

                        <div className="flex pt-16 pr-7 sm:pl-5 sm:pt-24 sm:pr-10 max-w-[540px] mb-14">
                            <div className="relative mb-[70rem] md:mb-[60rem]">
                                <div className="font-semibold text-3xl md:text-6xl [text-align-last:justify]">B - S i d e</div>
                                <div className="font-semibold text-3xl md:text-6xl [text-align-last:justify]">F e s t i v a l</div>
                                <div className="text-xl sm:text-3xl [text-align-last:justify]">2 0 2 4</div>

                                <div className="absolute top-full left-0 right-0 flex flex-col">
                                    <div className="mt-8 text-xl text-justify">
                                        Es geht wieder los: Das 8. B-Side Festival steht vor der Tür!
                                    </div>
                                    <div className="mt-2 text-xl text-justify">…und diesmal sogar vor neuen Türen:</div>

                                    <div className="mt-3 text-xs text-justify">
                                        Nachdem wir im letzten Jahr noch in unserer Zwischennutzung am Hawerkamp zu finden waren, freuen wir
                                        uns in diesem Jahr besonders den Hill-Speicher am Hafen wieder mit neuem Leben zu füllen. Vom 20.
                                        bis 21.09.2024 weihen wir das frisch renovierte Gebäude mit Kunst, Musik, Literatur und Workshops
                                        ein.
                                    </div>
                                    <div className="mt-3 text-xs text-justify">
                                        Passend zum neuen Ort, lautet das Motto in diesem Jahr: SPIELPLATZ FÜR KREATIVE
                                    </div>
                                    <div className="mt-3 text-xs text-justify">
                                        Du willst mit deiner Kunst Teil des bunten Programms werden? Deine Musik darf auf gar keinen Fall
                                        fehlen? Du hast eine spannende Idee, auf die wir bisher noch gar nicht gekommen sind? Super! Dann
                                        bewirb dich jetzt!
                                    </div>

                                    <div className="mt-3 text-right">
                                        <Link
                                            className="text-md cursor-pointer hover:text-red-700 flex items-center gap-2 leading-5 justify-end"
                                            href="/bewerbungen"
                                        >
                                            Zum Bewerbungsformular
                                            <FontAwesomeIcon className="w-4 pt-1 inline-block" icon={faArrowRight} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Image src="/assets/background.webp" alt="Hintergrund" className="object-cover object-top absolute z-0" fill={true} />
            </div>

            <Footer />
        </div>
    );
};
