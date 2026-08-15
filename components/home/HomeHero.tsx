'use client';

import { HeroDockDesktop, HeroDockMobile } from '@/components/home/hero/HeroDock';
import { HeroWaterDesktop, HeroWaterMobile } from '@/components/home/hero/HeroWater';
import type { ReactElement } from 'react';

const HomeHero = (): ReactElement => {
    return (
        <section className="relative aspect-[393/634] overflow-hidden bg-gradient-to-br from-[#f4b6d6] via-[#f7cfe2] to-white md:aspect-auto md:min-h-[78vh]">
            {/* Mobile: meet keeps Figma frame proportions so water lines stay with the blue fill */}
            <HeroWaterMobile className="pointer-events-none absolute inset-0 h-full w-full md:hidden" preserveAspectRatio="xMidYMax meet" />
            <HeroDockMobile className="pointer-events-none absolute inset-0 h-full w-full md:hidden" preserveAspectRatio="xMidYMax meet" />

            {/* Desktop: slice keeps dock flush to the viewport edge */}
            <HeroWaterDesktop
                className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
                preserveAspectRatio="xMaxYMax slice"
            />
            <HeroDockDesktop
                className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
                preserveAspectRatio="xMaxYMax slice"
            />
        </section>
    );
};

export default HomeHero;
