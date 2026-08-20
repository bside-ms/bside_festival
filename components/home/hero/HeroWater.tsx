'use client';

import AnimatedWaterLines from '@/components/home/hero/AnimatedWaterLines';
import {
    desktopWaterFillPath,
    desktopWaterLinePaths,
    mobileWaterFillPath,
    mobileWaterLinePaths,
} from '@/components/home/hero/heroWaterPaths';
import type { ReactElement, SVGProps } from 'react';

type WaterProps = SVGProps<SVGSVGElement> & {
    fillPath: string;
    linePaths: ReadonlyArray<string>;
};

const WaterSvg = ({ fillPath, linePaths, ...props }: WaterProps): ReactElement => (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={true} {...props}>
        <path d={fillPath} fill="#40a8f5" />
        <AnimatedWaterLines linePaths={linePaths} />
    </svg>
);

export const HeroWaterDesktop = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <WaterSvg viewBox="0 0 1440 800" fillPath={desktopWaterFillPath} linePaths={desktopWaterLinePaths} {...props} />
);

export const HeroWaterMobile = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <WaterSvg viewBox="0 0 393 634" fillPath={mobileWaterFillPath} linePaths={mobileWaterLinePaths} {...props} />
);
