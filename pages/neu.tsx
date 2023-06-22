import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import BHeartLinesSvg from 'components/common/BHeartLinesSvg';
import Footer from 'components/common/Footer';

export default (): ReactElement => {

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
                                    <BHeartLinesSvg color="#666" />
                                </div>
                            </div>
                        </div>

                        <div className="flex pt-16 pr-7 sm:pl-5 sm:pt-24 sm:pr-10 max-w-[540px]">
                            <div className="relative mb-[40rem]">
                                <div className="font-semibold text-6xl sm:text-8xl">
                                    B-Side<br />
                                    Festival
                                </div>

                                <div className="absolute top-full left-0 right-0 flex flex-col">
                                    <div className="text-lg sm:text-2xl [text-align-last:justify] mt-1">
                                        Interaktion Reaktion
                                    </div>
                                    <div className="text-xl sm:text-3xl [text-align-last:justify]">
                                        15. & 16. SEPT. 2023
                                    </div>
                                    <div className="text-xs sm:text-sm [text-align-last:justify] mt-1">
                                        Kunst, Kultur & Bildung am Hawerkamp
                                    </div>
                                    <div className="mt-3 bg-black text-gray-100 text-center text-xs sm:text-sm leading-4 py-3">
                                        Veranstaltet vom B-Side Kultur e.V.
                                    </div>
                                    <div className="mt-2 text-xs text-justify [text-align-last:justify]">
                                        Konzerte, Kunstausstellungen, Theater, Workshops, Kinder- & Familienprogramm,
                                        Vorträge, Lesungen und Diskussionsrunden.
                                    </div>
                                    <div className="mt-20 text-lg sm:text-2xl text-justify [text-align-last:justify]">
                                        Bewerbt euch jetzt!
                                    </div>
                                    <div className="mt-3 text-xs text-justify">
                                        Nachdem letztes Jahr ein voller Erfolg war, freuen wir uns auf
                                        September. Denn dann werden die Straßen wieder mit Kunst, Musik,
                                        Workshops und Theater gefüllt.
                                    </div>
                                    <div className="mt-3 text-xs text-justify">
                                        Ihr wollt mit eurer Kunst Teil des bunten Programms werden? Eure Musik
                                        darf auf gar keinen Fall fehlen? Ihr habt eine spannende Idee, auf die
                                        wir bisher noch gar nicht gekommen sind? Super! Dann bewerbt euch über
                                        dieses Formular!
                                    </div>
                                    <div className="mt-3 text-right">
                                        <Link className="text-md cursor-pointer hover:text-red-700" href="/bewerbungen">
                                            Zum Bewerbungsformular <FontAwesomeIcon icon={faArrowRight} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
