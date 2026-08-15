import type { ReactElement, SVGProps } from 'react';

/** Desktop harbor edge — viewBox matches Figma desktop; use with xMaxYMax slice so it stays flush to the viewport bottom-right. */
export const HeroDockDesktop = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <svg viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={true} {...props}>
        {/* side wall — right edge pushed past viewBox so it never runs out on wide screens */}
        <polygon points="901.8 756.8 3200 980 3200 560 928 543.4" fill="#111" />
        {/* top deck — fill + outline; round join avoids miter spike at the left tip */}
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

/** Mobile harbor edge — fills the lower block across the screen (Figma mobile geometry). */
export const HeroDockMobile = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <svg viewBox="0 0 393 634" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={true} {...props}>
        <polygon points="87.8 634.4 520 634.4 520 476.1 112 441" fill="#111" />
        {/* Figma used a 3-point deck; a 4th near-duplicate tip point caused the broken spike */}
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
