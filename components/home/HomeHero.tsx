'use client';

import { HeroDockDesktop, HeroDockMobile } from '@/components/home/hero/HeroDock';
import { HeroWaterDesktop, HeroWaterMobile } from '@/components/home/hero/HeroWater';
import logoMark from '@/images/2026/logo_transparent.svg';
import { homeDateDays, homeDateMonth } from '@/lib/public/homeContent';
import Image from 'next/image';
import type { ReactElement } from 'react';

type DateStampProps = {
    className: string;
    daySize: number;
    monthDy: number;
    monthSize: number;
    preserveAspectRatio: string;
    viewBox: string;
    x: number;
    y: number;
};

const HeroDateStamp = ({ className, daySize, monthDy, monthSize, preserveAspectRatio, viewBox, x, y }: DateStampProps): ReactElement => (
    <svg viewBox={viewBox} className={className} preserveAspectRatio={preserveAspectRatio} aria-hidden={true}>
        <text x={x} y={y} fill="#f2c48d" fontFamily="BricolageGrotesque, sans-serif" fontWeight="800" fontSize={daySize}>
            <tspan x={x} dy="0">
                {homeDateDays}
            </tspan>
            <tspan x={x} dy={monthDy} fontSize={monthSize}>
                {homeDateMonth}
            </tspan>
        </text>
    </svg>
);

const HomeHero = (): ReactElement => {
    return (
        <section className="relative h-[calc(100dvh-3.75rem)] max-h-[56rem] overflow-hidden bg-gradient-to-br from-[#f4b6d6] via-[#f7cfe2] to-white">
            {/* 3.75rem = public header h-15, so header + hero fill the viewport until max-h */}
            {/* slice + yMax: cover the viewport box, keep dock/waves on the bottom edge, crop leftover sky */}
            <HeroWaterMobile
                className="pointer-events-none absolute inset-0 h-full w-full md:hidden"
                preserveAspectRatio="xMidYMax slice"
            />
            <HeroDockMobile className="pointer-events-none absolute inset-0 h-full w-full md:hidden" preserveAspectRatio="xMidYMax slice" />
            <HeroDateStamp
                className="pointer-events-none absolute inset-0 h-full w-full md:hidden"
                preserveAspectRatio="xMidYMax slice"
                viewBox="0 0 393 634"
                x={140}
                y={548}
                daySize={36}
                monthSize={28}
                monthDy={28}
            />

            {/* Desktop: slice keeps dock flush to the viewport edge */}
            <HeroWaterDesktop
                className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
                preserveAspectRatio="xMaxYMax slice"
            />
            <HeroDockDesktop
                className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
                preserveAspectRatio="xMaxYMax slice"
            />
            <HeroDateStamp
                className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
                preserveAspectRatio="xMaxYMax slice"
                viewBox="0 0 1440 800"
                x={1008}
                y={658}
                daySize={76}
                monthSize={62}
                monthDy={58}
            />

            <Image
                src={logoMark}
                alt=""
                width={439}
                height={439}
                aria-hidden={true}
                priority
                className="pointer-events-none absolute top-2 right-0 z-10 h-auto w-48 md:top-auto md:right-[12%] md:bottom-[42%] md:w-64"
            />

            <p className="sr-only">
                {homeDateDays} {homeDateMonth}
            </p>
        </section>
    );
};

export default HomeHero;
