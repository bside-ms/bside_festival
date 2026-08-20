'use client';

import GideonRothmannDscf4816 from '@/images/2025/gallery/gideon-rothmann-dscf4816.webp';
import GideonRothmannDscf4830 from '@/images/2025/gallery/gideon-rothmann-dscf4830.webp';
import GideonRothmannDscf4865 from '@/images/2025/gallery/gideon-rothmann-dscf4865.webp';
import GideonRothmannDscf4882 from '@/images/2025/gallery/gideon-rothmann-dscf4882.webp';
import GideonRothmannDscf4887 from '@/images/2025/gallery/gideon-rothmann-dscf4887.webp';
import GideonRothmannDscf4899 from '@/images/2025/gallery/gideon-rothmann-dscf4899.webp';
import GideonRothmannDscf4976 from '@/images/2025/gallery/gideon-rothmann-dscf4976.webp';
import GideonRothmannDscf5003 from '@/images/2025/gallery/gideon-rothmann-dscf5003.webp';
import GideonRothmannDscf5007 from '@/images/2025/gallery/gideon-rothmann-dscf5007.webp';
import GideonRothmannDscf5034 from '@/images/2025/gallery/gideon-rothmann-dscf5034.webp';
import LauraWindheuserImg4015 from '@/images/2025/gallery/laura-windheuser-img_4015.webp';
import LauraWindheuserImg4021 from '@/images/2025/gallery/laura-windheuser-img_4021.webp';
import LauraWindheuserImg4031 from '@/images/2025/gallery/laura-windheuser-img_4031.webp';
import LauraWindheuserImg4154 from '@/images/2025/gallery/laura-windheuser-img_4154.webp';
import LauraWindheuserImg4211 from '@/images/2025/gallery/laura-windheuser-img_4211.webp';
import LauraWindheuserImg4238 from '@/images/2025/gallery/laura-windheuser-img_4238.webp';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image, { type StaticImageData } from 'next/image';
import type { MouseEvent, ReactElement } from 'react';
import { useCallback, useEffect, useState } from 'react';

type GalleryPhoto = {
    alt: string;
    credit: string;
    image: StaticImageData;
};

const galleryPhotos: GalleryPhoto[] = [
    { image: GideonRothmannDscf4816, alt: 'Besucher*innen auf dem B-Side Festival 2025', credit: 'Gideon Rothmann' },
    { image: GideonRothmannDscf4830, alt: 'Live-Musik beim B-Side Festival 2025', credit: 'Gideon Rothmann' },
    { image: GideonRothmannDscf4865, alt: 'Festivalmoment beim B-Side Festival 2025', credit: 'Gideon Rothmann' },
    { image: GideonRothmannDscf4882, alt: 'Konzertpublikum beim B-Side Festival 2025', credit: 'Gideon Rothmann' },
    { image: GideonRothmannDscf4887, alt: 'Künstlerische Performance beim B-Side Festival 2025', credit: 'Gideon Rothmann' },
    { image: GideonRothmannDscf4899, alt: 'Besucher*in beim B-Side Festival 2025', credit: 'Gideon Rothmann' },
    { image: GideonRothmannDscf4976, alt: 'Festivalstimmung beim B-Side Festival 2025', credit: 'Gideon Rothmann' },
    { image: GideonRothmannDscf5003, alt: 'Musik auf dem B-Side Festival 2025', credit: 'Gideon Rothmann' },
    { image: GideonRothmannDscf5007, alt: 'Menschen beim B-Side Festival 2025', credit: 'Gideon Rothmann' },
    { image: GideonRothmannDscf5034, alt: 'Abendstimmung beim B-Side Festival 2025', credit: 'Gideon Rothmann' },
    { image: LauraWindheuserImg4015, alt: 'Festivalimpression beim B-Side Festival 2025', credit: 'Laura Windheuser' },
    { image: LauraWindheuserImg4021, alt: 'Besucher*innen beim B-Side Festival 2025', credit: 'Laura Windheuser' },
    { image: LauraWindheuserImg4031, alt: 'Programm beim B-Side Festival 2025', credit: 'Laura Windheuser' },
    { image: LauraWindheuserImg4154, alt: 'Gemeinsamer Moment beim B-Side Festival 2025', credit: 'Laura Windheuser' },
    { image: LauraWindheuserImg4211, alt: 'Festivalgeschehen beim B-Side Festival 2025', credit: 'Laura Windheuser' },
    { image: LauraWindheuserImg4238, alt: 'Eindrücke vom B-Side Festival 2025', credit: 'Laura Windheuser' },
];

const Gallery = (): ReactElement => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const selectedPhoto = selectedIndex === null ? null : galleryPhotos[selectedIndex];

    const closeLightbox = useCallback((): void => {
        setSelectedIndex(null);
    }, []);

    const showPreviousPhoto = useCallback((): void => {
        setSelectedIndex((currentIndex) =>
            currentIndex === null ? null : (currentIndex - 1 + galleryPhotos.length) % galleryPhotos.length,
        );
    }, []);

    const showNextPhoto = useCallback((): void => {
        setSelectedIndex((currentIndex) => (currentIndex === null ? null : (currentIndex + 1) % galleryPhotos.length));
    }, []);

    const openLightbox = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
        setSelectedIndex(Number(event.currentTarget.value));
    }, []);

    const stopLightboxPropagation = useCallback((event: MouseEvent<HTMLDivElement>): void => {
        event.stopPropagation();
    }, []);

    useEffect(() => {
        if (selectedIndex === null) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'ArrowLeft') {
                showPreviousPhoto();
            }

            if (event.key === 'ArrowRight') {
                showNextPhoto();
            }

            if (event.key === 'Escape') {
                closeLightbox();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [closeLightbox, selectedIndex, showNextPhoto, showPreviousPhoto]);

    return (
        <>
            <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
                {galleryPhotos.map((photo, index) => (
                    <div key={photo.image.src} className="mb-4 break-inside-avoid">
                        <button
                            type="button"
                            value={index}
                            onClick={openLightbox}
                            className="group block w-full cursor-zoom-in overflow-hidden rounded-sm bg-black/10 focus-visible:ring-4 focus-visible:ring-[#2C2E83] focus-visible:outline-none"
                            aria-label={`${photo.alt} vergrößern`}
                        >
                            <Image
                                src={photo.image}
                                alt={photo.alt}
                                className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        </button>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedPhoto && selectedIndex !== null && (
                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${selectedPhoto.alt}, Foto: ${selectedPhoto.credit}`}
                        className="fixed inset-0 z-50 grid place-items-center bg-[#12122e]/95 p-4 sm:p-8"
                        onClick={closeLightbox}
                    >
                        <div className="relative flex max-h-full w-full max-w-6xl flex-col items-center" onClick={stopLightboxPropagation}>
                            <Image
                                src={selectedPhoto.image}
                                alt={selectedPhoto.alt}
                                className="max-h-[78dvh] w-auto max-w-full rounded-sm object-contain"
                                sizes="100vw"
                                priority
                            />
                            <div className="mt-3 flex w-full items-center justify-between gap-4 text-sm font-bold text-white">
                                <span>Foto: {selectedPhoto.credit}, 2025</span>
                                <span>
                                    {selectedIndex + 1} / {galleryPhotos.length}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={closeLightbox}
                                className="absolute top-3 right-3 cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-black text-[#2C2E83] transition hover:bg-[#40A8F5] hover:text-white focus-visible:ring-4 focus-visible:ring-[#40A8F5] focus-visible:outline-none"
                            >
                                Schließen
                            </button>
                            <button
                                type="button"
                                onClick={showPreviousPhoto}
                                className="absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer rounded-full bg-white px-4 py-3 font-black text-[#2C2E83] transition hover:bg-[#40A8F5] hover:text-white focus-visible:ring-4 focus-visible:ring-[#40A8F5] focus-visible:outline-none"
                                aria-label="Vorheriges Foto"
                            >
                                ←
                            </button>
                            <button
                                type="button"
                                onClick={showNextPhoto}
                                className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer rounded-full bg-white px-4 py-3 font-black text-[#2C2E83] transition hover:bg-[#40A8F5] hover:text-white focus-visible:ring-4 focus-visible:ring-[#40A8F5] focus-visible:outline-none"
                                aria-label="Nächstes Foto"
                            >
                                →
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Gallery;
