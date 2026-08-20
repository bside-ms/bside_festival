'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactElement } from 'react';

type Props = {
    linePaths: ReadonlyArray<string>;
};

const AnimatedWaterLines = ({ linePaths }: Props): ReactElement => {
    const reduceMotion = useReducedMotion();

    return (
        <>
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
        </>
    );
};

export default AnimatedWaterLines;
