import type { ReactElement, SVGProps } from 'react';

export const HeroDockDesktop = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <svg viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={true} {...props}>
        <polygon points="901.8 756.8 3200 980 3200 560 928 543.4" fill="#111" />
        <polygon
            points="3200 300 1290.6 432.1 928.9 544.4 1451.5 612 3200 560"
            fill="#fff"
            stroke="#111"
            strokeWidth="7"
            strokeLinejoin="round"
            strokeLinecap="round"
        />
    </svg>
);

export const HeroDockMobile = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <svg viewBox="0 0 393 634" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={true} {...props}>
        <polygon points="87.8 634.4 520 634.4 520 476.1 112 441" fill="#111" />
        <polygon
            points="112.9 441.9 520 330 520 476.1"
            fill="#fff"
            stroke="#111"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
        />
    </svg>
);
