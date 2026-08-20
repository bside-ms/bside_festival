'use client';

import AnimatedWaterLines from '@/components/home/hero/AnimatedWaterLines';
import { desktopWaterLinePaths } from '@/components/home/hero/heroWaterPaths';
import type { ReactElement } from 'react';

const FooterWaves = (): ReactElement => (
    <svg viewBox="0 608 1440 212" className="block h-24 w-full md:h-32" preserveAspectRatio="none" aria-hidden={true}>
        <AnimatedWaterLines linePaths={desktopWaterLinePaths} />
    </svg>
);

export default FooterWaves;
