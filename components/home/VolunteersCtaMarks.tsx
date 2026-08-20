import volunteersArrow from '@/images/2026/home/volunteers-arrow.svg';
import volunteersSwooshes from '@/images/2026/home/volunteers-swooshes.svg';
import type { ReactElement } from 'react';

const VolunteersCtaMarks = (): ReactElement => (
    <>
        <img
            src={volunteersArrow.src}
            alt=""
            aria-hidden={true}
            className="pointer-events-none absolute -top-6 -left-6 w-36 max-w-none sm:-top-3 sm:-left-4 sm:w-40 md:top-auto md:bottom-[42%] md:left-[3%] md:w-32 lg:left-[6%] lg:w-36 xl:left-[9%] xl:w-40"
        />
        <img
            src={volunteersSwooshes.src}
            alt=""
            aria-hidden={true}
            className="pointer-events-none absolute -right-14 -bottom-10 w-52 max-w-none sm:-right-8 sm:-bottom-4 sm:w-60 md:top-[12%] md:right-0 md:bottom-auto md:w-64 lg:right-[4%] lg:w-72 xl:right-[8%] xl:w-80"
        />
    </>
);

export default VolunteersCtaMarks;
