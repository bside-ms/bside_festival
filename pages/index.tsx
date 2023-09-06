import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import BackgroundImage from 'components/common/BackgroundImage';
import BHeartLinesSvg from 'components/common/BHeartLinesSvg';
import Footer from 'components/common/Footer';
import VolunteerInfo from 'components/volunteers/volunteerForm/VolunteerInfo';
import typeLabels from 'lib/participants/typeLabels';

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
                                    <BHeartLinesSvg color="#888" />
                                </div>
                            </div>
                        </div>

                        <div className="flex pt-16 pr-7 sm:pl-5 sm:pt-24 sm:pr-10 max-w-[540px] mb-14">
                            <div className="relative mb-[70rem] md:mb-[60rem]">
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
                                    <div className="mt-14 text-xl">
                                        Konzerte, Kunstausstellungen, Theater, Workshops, Kinder- & Familien&shy;programm,
                                        Vorträge, Lesungen und Diskussionsrunden.
                                    </div>

                                    <div className="mt-8 flex">
                                        <Link
                                            className="cursor-pointer hover:bg-gray-800 bg-black text-white px-4 rounded-sm flex items-center gap-2 leading-3"
                                            href="/programm"
                                        >
                                            <div className="font-display text-xl md:text-4xl pb-2 md:pb-3">zum Programm</div>
                                            <div><FontAwesomeIcon className="w-3 md:w-6 md:pt-1 inline-block" icon={faArrowRight} /></div>
                                        </Link>
                                    </div>

                                    <div className="mt-16 text-lg sm:text-2xl font-bold">
                                        Wir brauchen euch!
                                    </div>

                                    <div className="text-xs mt-3">
                                        <VolunteerInfo />
                                    </div>

                                    <div className="mt-3 text-right">
                                        <Link className="text-md cursor-pointer hover:text-red-700 flex items-center gap-2 leading-5 justify-end" href="/mithelfen">
                                            Zum Formular für Helfer:innen <FontAwesomeIcon className="w-4 pt-1 inline-block" icon={faArrowRight} />
                                        </Link>
                                    </div>

                                    <div className="mt-14 flex">
                                        <Link
                                            className="cursor-pointer hover:bg-gray-800 bg-black text-white px-4 rounded-sm flex items-center gap-2 leading-3"
                                            href="/awareness"
                                        >
                                            <div className="font-display text-xl md:text-4xl pb-2 md:pb-3">Awareness</div>
                                            <div><FontAwesomeIcon className="w-3 md:w-6 md:pt-1 inline-block" icon={faArrowRight} /></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full relative pb-14 md:pb-32">
                    <div className="relative z-10">
                        <div className="px-20 md:px-5 max-w-xl mx-auto">
                            <Image
                                src="/assets/map.svg"
                                alt={typeLabels.Reading}
                                width="128"
                                height="128"
                                layout="responsive"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
