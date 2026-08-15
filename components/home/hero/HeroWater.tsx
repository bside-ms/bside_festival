'use client';

import {
    desktopWaterFillPath,
    desktopWaterLinePaths,
    mobileWaterFillPath,
    mobileWaterLinePaths,
} from '@/components/home/hero/heroWaterPaths';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactElement, SVGProps } from 'react';

type WaterProps = SVGProps<SVGSVGElement> & {
    fillPath: string;
    linePaths: ReadonlyArray<string>;
};

const WaterSvg = ({ fillPath, linePaths, ...props }: WaterProps): ReactElement => {
    const reduceMotion = useReducedMotion();

    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={true} {...props}>
            <path d={fillPath} fill="#40a8f5" />
            {linePaths.map((d, index) => {
                const amp = 2 + (index % 3);
                const duration = 3.2 + (index % 5) * 0.35;
                const delay = (index % 7) * 0.18;
                return (
                    <motion.path
                        key={d.slice(0, 48)}
                        d={d}
                        fill="#1d2a6b"
                        animate={reduceMotion ? undefined : { y: [0, -amp, 0, amp * 0.6, 0] }}
                        transition={
                            reduceMotion ? undefined : { duration, repeat: Infinity, ease: 'easeInOut', delay, repeatType: 'mirror' }
                        }
                    />
                );
            })}
        </svg>
    );
};

export const HeroWaterDesktop = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <WaterSvg viewBox="0 0 1440 800" fillPath={desktopWaterFillPath} linePaths={desktopWaterLinePaths} {...props} />
);

export const HeroWaterMobile = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <WaterSvg viewBox="0 0 393 634" fillPath={mobileWaterFillPath} linePaths={mobileWaterLinePaths} {...props} />
);
