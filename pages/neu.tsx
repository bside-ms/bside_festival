import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';

export default (): ReactElement => {

    return (
        <div>
            <div className="min-h-screen w-full relative font-display">
                <div className="relative z-10">
                    <div className="flex">
                        <div className="w-1/3 sm:w-2/5 relative max-w-[460px]">
                            <div className="absolute w-full min-w-[200px] h-40 md:h-96">
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/assets/frontpage-heart-red.webp"
                                        alt="Eyecatcher"
                                        fill={true}
                                        className="object-contain object-left"
                                    />
                                </div>
                            </div>
                            <div className="absolute hidden md:block top-96 w-full min-w-[200px] h-40 md:h-96">
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/assets/frontpage-heart-black.webp"
                                        alt="Eyecatcher"
                                        fill={true}
                                        className="object-contain object-left"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex pt-16 pr-7 md:pl-5 md:pt-24 md:pr-10 max-w-[540px]">
                            <div className="relative mb-60">
                                <div className="font-semibold text-6xl md:text-8xl">
                                    B-Side<br />
                                    Festival
                                </div>

                                <div className="absolute top-full left-0 right-0 flex flex-col">
                                    <div className="text-lg md:text-2xl [text-align-last:justify] mt-1">
                                        Interaktion Reaktion
                                    </div>
                                    <div className="text-xl md:text-3xl [text-align-last:justify]">
                                        15. & 16. SEPT. 2023
                                    </div>
                                    <div className="text-xs md:text-sm [text-align-last:justify] mt-1">
                                        Kunst, Kultur & Bildung am Hawerkamp
                                    </div>
                                    <div className="mt-3 bg-black text-gray-100 text-center text-xs md:text-sm leading-4 py-3">
                                        Veranstaltet vom B-Side Kultur e.V.
                                    </div>
                                    <div className="mt-2 text-xs text-justify [text-align-last:justify]">
                                        Konzerte, Kunstausstellungen, Theater, Workshops, Kinder- & Familienprogramm,
                                        Vorträge, Lesungen und Diskussionsrunden.
                                    </div>
                                    <div className="mt-20 text-lg md:text-2xl text-justify [text-align-last:justify]">
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

                <Image
                    src="/assets/background.webp"
                    alt="Hintergrund"
                    className="object-cover object-top absolute z-0"
                    fill={true}
                />
            </div>

            <Footer />
        </div>
    );
};
