import Eyecatcher from '@/components/common/Eyecatcher';
import ArrowIcon from '@/components/common/icons/ArrowIcon';
import handsHolding from '@/images/handsHolding.webp';
import keyVisualImage from '@/images/keyVisual.webp';
import pinkBackgroundBottom from '@/images/pinkBackgroundBottom.svg';
import pinkBackgroundTop from '@/images/pinkBackgroundTop.svg';
import whiteBackgroundBottom from '@/images/whiteBackgroundBottom.svg';
import whiteBackgroundTop from '@/images/whiteBackgroundTop.svg';
import { isBefore } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    const volunteerDeadline = new Date('2025-09-19');

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-2xl min-w-[300px] pt-2 font-display">
            <Image src={keyVisualImage} alt="Festival-Plakat" className="object-cover" />

            <div className="my-3 flex h-20 justify-center md:my-8 md:h-52">
                <div className="md:hidden">
                    <ArrowIcon size={80} color="#36a9e1" />
                </div>
                <div className="hidden md:block">
                    <ArrowIcon size={180} color="#36a9e1" />
                </div>
            </div>

            <div className="flex flex-col items-center font-mono text-9xl text-[#36a9e1]">
                <div className="scale-x-150">19.</div>
                <div className="scale-x-150">20.</div>
                <div className="scale-x-125">Sept</div>
            </div>

            <div className="relative z-20 mt-8 xs:mt-5 md:mt-11">
                <Image src={pinkBackgroundTop} alt="" width={2000} className="object-cover" />

                <div className="bg-[#ebc9de] px-4">
                    <div className="mb-3 text-center font-mono text-2xl uppercase sm:mb-7 sm:text-3xl md:mb-11 md:text-4xl">
                        Wir gehen in die 9. Runde!
                    </div>

                    <div className="text-sm sm:text-base md:text-xl">
                        Am 19. & 20. September laden wir euch herzlich in den Mittelhafen und in das Hansaviertel ein! Ganz nach dem Motto
                        B-together, B-loved – B-Side! stehen in diesem Jahr besonders die Gemeinschaft, Begegnung und Empathie im Zentrum.
                        Mit Musik, Ausstellungen, Workshops, Vorträgen, Familienprogramm, verschiedenen Infoständen und Lesungen bieten wir
                        euch wieder ein vielfältiges Programm an bei dem für alle etwas dabei ist.
                    </div>
                </div>

                <Image src={pinkBackgroundBottom} alt="" width={2000} className="object-cover" />
            </div>

            <Image
                src={handsHolding}
                alt=""
                className="-translate-x-10 -translate-y-5 -rotate-6 md:translate-x-0 md:-translate-y-10 md:scale-95 md:rotate-0"
            />

            <div className="mb-11 flex text-center font-mono text-7xl leading-20 text-[#E9531F] uppercase">Eintritt kostenlos</div>

            <div className="mb-5 space-y-4 px-8">
                <Link href="/programm" className="flex rotate-2 items-center justify-center gap-2 hover:text-[#B0C42A]">
                    <div className="rotate-[270deg] pl-2">
                        <ArrowIcon size={40} color="black" />
                    </div>
                    <div className="text-5xl uppercase">Programm</div>
                </Link>

                <Link href="/awareness" className="flex -rotate-2 items-center justify-center gap-2 hover:text-[#B0C42A]">
                    <div className="text-5xl uppercase">Awareness</div>
                    <div className="rotate-[90deg] pr-2">
                        <ArrowIcon size={40} color="black" />
                    </div>
                </Link>
            </div>

            <div className="mb-8 px-8">
                <Eyecatcher stroke="black" fill="yellow">
                    <div className="text-center font-mono uppercase">
                        <div className="text-5xl">Aftershow</div>
                        <div className="text-xl whitespace-nowrap">Sa 22:00 Sputnikhalle</div>
                    </div>
                </Eyecatcher>
            </div>

            {isBefore(new Date(), volunteerDeadline) && (
                <div className="relative z-20 mb-14 xs:mt-5 md:mt-11">
                    <Image src={whiteBackgroundTop} alt="" width={2000} className="object-cover" />

                    <div className="bg-white px-4 py-4">
                        <div className="mb-10 text-center font-mono text-2xl uppercase sm:mb-14 sm:text-3xl md:mb-11 md:text-4xl">
                            Lust mitzumachen?
                        </div>

                        <div className="text-sm xs:text-base md:text-xl">
                            Am 19. & 20. September heißt es wieder: B-together, B-loved – B-Side! Damit das Festival am Mittelhafen und
                            Hansaviertel lebendig, vielfältig und offen für alle wird, brauchen wir deine Unterstützung. Ob beim Aufbau, in
                            der Technik, bei Konzerten, Workshops, Lesungen oder als Teil der Awareness- und Verpflegungsteams – es gibt
                            viele Möglichkeiten, mitzumachen. Du musst nichts mitbringen außer Zeit, Lust und Offenheit. Ganz egal, ob du
                            zum ersten Mal hilfst oder schon Erfahrung hast: Du bist willkommen! Gemeinsam gestalten wir etwas, das
                            verbindet – mach mit und werde Teil des B-Side Festivals 2025!
                        </div>

                        <div className="mt-10 space-y-4 px-8">
                            <Link href="/mithelfen" className="flex items-center justify-center gap-2 hover:text-[#B0C42A]">
                                <div className="rotate-[270deg] pl-2">
                                    <ArrowIcon size={40} color="black" />
                                </div>
                                <div className="text-3xl uppercase">Zur Anmeldung</div>
                            </Link>
                        </div>
                    </div>

                    <Image src={whiteBackgroundBottom} alt="" width={2000} className="object-cover" />
                </div>
            )}
        </div>
    );
};
