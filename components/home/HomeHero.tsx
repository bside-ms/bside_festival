import { HeroDockDesktop, HeroDockMobile } from '@/components/home/hero/HeroDock';
import { HeroMottoDesktop } from '@/components/home/hero/HeroMottoDesktop';
import { HeroMottoMobile } from '@/components/home/hero/HeroMottoMobile';
import { HeroWaterDesktop, HeroWaterMobile } from '@/components/home/hero/HeroWater';
import zehnJahreBadge from '@/images/2026/home/zehn-jahre-badge.svg';
import logoMark from '@/images/2026/logo_transparent.svg';
import { homeDateDays, homeDateMonth, homeMotto } from '@/lib/public/homeContent';
import Image from 'next/image';
import type { ReactElement } from 'react';

type HarborStampProps = {
    className: string;
    preserveAspectRatio: string;
    viewBox: string;
};

const HeroDateStamp = ({
    className,
    daySize,
    monthDy,
    monthSize,
    preserveAspectRatio,
    viewBox,
    x,
    y,
}: HarborStampProps & { daySize: number; monthDy: number; monthSize: number; x: number; y: number }): ReactElement => (
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

const HeroBadgeStamp = ({
    className,
    height,
    preserveAspectRatio,
    viewBox,
    width,
    x,
    y,
}: HarborStampProps & { height: number; width: number; x: number; y: number }): ReactElement => (
    <svg viewBox={viewBox} className={className} preserveAspectRatio={preserveAspectRatio} aria-hidden={true}>
        <image href={zehnJahreBadge.src} x={x} y={y} width={width} height={height} />
    </svg>
);

const HomeHero = (): ReactElement => (
    <section className="relative h-[calc(100dvh-3.75rem)] max-h-224 overflow-hidden bg-linear-to-br from-[#f4b6d6] via-[#f7cfe2] to-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[-8%] md:hidden">
            <HeroWaterMobile className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" />
            <HeroDockMobile className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" />

            <HeroDateStamp
                className="absolute inset-0 h-full w-full min-[410px]:hidden"
                preserveAspectRatio="xMidYMax slice"
                viewBox="0 0 393 634"
                x={130}
                y={498}
                daySize={25}
                monthSize={23}
                monthDy={22}
            />
            <HeroDateStamp
                className="absolute inset-0 hidden h-full w-full min-[410px]:block"
                preserveAspectRatio="xMidYMax slice"
                viewBox="0 0 393 634"
                x={130}
                y={498}
                daySize={30}
                monthSize={28}
                monthDy={28}
            />

            <HeroBadgeStamp
                className="absolute inset-0 hidden h-full w-full min-[410px]:block min-[510px]:hidden"
                preserveAspectRatio="xMidYMax slice"
                viewBox="0 0 393 634"
                x={303}
                y={458}
                width={48}
                height={176}
            />
            <HeroBadgeStamp
                className="absolute inset-0 hidden h-full w-full min-[510px]:block"
                preserveAspectRatio="xMidYMax slice"
                viewBox="0 0 393 634"
                x={313}
                y={458}
                width={58}
                height={176}
            />
        </div>
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
            x={958}
            y={628}
            daySize={56}
            monthSize={52}
            monthDy={48}
        />
        <HeroBadgeStamp
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            preserveAspectRatio="xMaxYMax slice"
            viewBox="0 0 1440 800"
            x={1298}
            y={624}
            width={108}
            height={186}
        />

        <div className="absolute inset-0 z-10 mx-auto w-full max-w-300">
            <Image
                src={logoMark}
                alt=""
                width={439}
                height={439}
                aria-hidden={true}
                priority
                className="pointer-events-none absolute top-8 right-4 z-20 h-auto w-32 sm:right-5 sm:w-40 md:top-10 md:right-6 md:w-48 lg:w-60 xl:w-72"
            />

            <div className="flex h-full items-center justify-center">
                <div className="min-h-0 w-full -translate-y-20 overflow-hidden min-[630px]:-translate-y-30 md:hidden">
                    <HeroMottoMobile className="max-h-125" />
                </div>

                <div className="mr-auto hidden min-h-0 w-4/5 -translate-y-20 overflow-hidden min-[960px]:w-3/4 min-[960px]:-translate-y-30 min-[1000px]:w-2/3 min-[1120px]:-translate-y-20 min-[1400px]:w-[70%] min-[1600px]:w-[72%] md:block">
                    <HeroMottoDesktop className="h-full w-full" />
                </div>
            </div>
        </div>

        <p className="sr-only">
            {homeMotto} {homeDateDays} {homeDateMonth} 10 Jahre B-Side Festival
        </p>
    </section>
);

export default HomeHero;
