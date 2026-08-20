'use client';

import buildingPhoto from '@/images/2026/home/building-photo.png';
import { motion, useReducedMotion } from 'framer-motion';
import { range } from 'lodash';
import Image from 'next/image';
import type { ReactElement } from 'react';

const floorCount = 3;

const HomeBuilding = (): ReactElement => {
    const reduceMotion = useReducedMotion();

    return (
        <div className="relative mx-auto w-full max-w-lg">
            <div className="pointer-events-none absolute -inset-6 rounded-[45%] bg-white/70 blur-md sm:-inset-10" aria-hidden={true} />
            <div className="relative aspect-square overflow-hidden">
                {range(floorCount).map((floorFromTop) => {
                    const floorFromBottom = floorCount - 1 - floorFromTop;
                    const clipTop = (floorFromTop / floorCount) * 100;
                    const clipBottom = ((floorCount - 1 - floorFromTop) / floorCount) * 100;

                    return (
                        <motion.div
                            key={`floor-${floorFromTop}`}
                            className="absolute inset-0"
                            style={{ clipPath: `inset(${clipTop}% 0 ${clipBottom}% 0)` }}
                            initial={reduceMotion ? false : { opacity: 0, y: 48, scale: 0.96 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={
                                reduceMotion
                                    ? { duration: 0 }
                                    : { delay: 0.1 + floorFromBottom * 0.28, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                            }
                        >
                            <Image
                                src={buildingPhoto}
                                alt=""
                                fill
                                className="object-contain drop-shadow-xl"
                                sizes="(max-width: 768px) 100vw, 32rem"
                            />
                        </motion.div>
                    );
                })}
            </div>
            <span className="sr-only">Zeichnung des B-Side Gebäudes mit drei Etagen</span>
        </div>
    );
};

export default HomeBuilding;
