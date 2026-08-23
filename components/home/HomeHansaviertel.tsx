import hansaviertel from '@/images/2026/home/hansaviertel.svg';
import Image from 'next/image';
import type { ReactElement } from 'react';

const HomeHansaviertel = (): ReactElement => (
    <section className="relative overflow-hidden bg-[#69BFFF] text-white">
        <div className="relative mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
            <h2 className="text-2xl leading-tight font-black sm:text-3xl">
                Hansaviertel
                <span className="block text-lg sm:text-xl">Samstag</span>
            </h2>

            <Image
                src={hansaviertel}
                alt="Illustration der Orte im Hansaviertel"
                className="mt-8 h-auto w-full md:mt-10"
                sizes="(max-width: 1280px) 100vw, 72rem"
            />
        </div>
    </section>
);

export default HomeHansaviertel;
