import HomeBuilding from '@/components/home/HomeBuilding';
import locationsDrip from '@/images/2026/home/locations-drip.svg';
import locationsLegend from '@/images/2026/home/locations-legend.svg';
import { homeStatsLine } from '@/lib/public/homeContent';
import Image from 'next/image';
import type { ReactElement } from 'react';

const LocationLegend = (): ReactElement => (
    <div className="relative mx-auto aspect-[514/542] w-full max-w-md">
        <Image
            src={locationsLegend}
            alt="Legende der Programmorte in der B-Side"
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 32rem"
        />
    </div>
);

const HomeLocations = (): ReactElement => (
    <section id="wo-und-wann" className="relative z-10 scroll-mt-16 overflow-visible bg-[#40A8F5] text-white">
        <Image src={locationsDrip} alt="" className="pointer-events-none absolute top-0 left-1/2 z-0 h-auto w-44 md:w-60" sizes="240px" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
            <div>
                <div>
                    <div className="text-xs font-bold tracking-[0.2em] uppercase">Wo &amp; Wann</div>
                    <h2 className="mt-2 text-4xl leading-none font-black text-[#FABF74] sm:text-5xl md:text-6xl">Die Locations</h2>
                    <p className="mt-6 text-sm font-bold md:text-base">{homeStatsLine}</p>
                    <p className="mt-5 text-2xl leading-tight font-black sm:text-3xl">
                        B-Side
                        <span className="block text-lg sm:text-xl">Freitag &amp; Samstag</span>
                    </p>
                </div>
            </div>

            <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-center lg:gap-12">
                <HomeBuilding />
                <LocationLegend />
            </div>
        </div>
    </section>
);

export default HomeLocations;
