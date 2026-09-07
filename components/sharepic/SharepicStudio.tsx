'use client';

import cn from '@/lib/common/helper/cn';
import {
    parseSharepicPosition,
    parseSharepicZoom,
    type SharepicFormat,
    sharepicFormats,
    sharepicImagePath,
    type SharepicLang,
    sharepicZoomMax,
} from '@/lib/sharepic/sharepicFormats';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseAsFloat, parseAsInteger, parseAsStringLiteral, useQueryState } from 'nuqs';
import type { ChangeEvent, ReactElement } from 'react';
import { useCallback, useEffect, useState } from 'react';

interface Props {
    canceled: boolean;
    format: SharepicFormat;
    hasPhoto: boolean;
    id: number;
    lang: SharepicLang;
    name: string;
    showPhoto: boolean;
}

const formatValues = ['feed', 'story'] as const;
const photoValues = ['1', '0'] as const;
const langValues = ['de', 'en'] as const;

const optionClassName = (active: boolean): string =>
    cn('rounded-sm px-4 py-2 font-black transition', active ? 'bg-[#2C2E83] text-white' : 'bg-white text-[#2C2E83] hover:bg-[#2C2E83]/10');

const SharepicStudio = ({ canceled, format, hasPhoto, id, lang, name, showPhoto }: Props): ReactElement => {
    const [formatState, setFormat] = useQueryState('format', parseAsStringLiteral(formatValues).withDefault(format));
    const [photoState, setPhoto] = useQueryState('photo', parseAsStringLiteral(photoValues).withDefault(showPhoto ? '1' : '0'));
    const [langState, setLang] = useQueryState('lang', parseAsStringLiteral(langValues).withDefault(lang));
    const [zoomState, setZoom] = useQueryState('zoom', parseAsFloat.withDefault(1));
    const [xState, setX] = useQueryState('x', parseAsInteger.withDefault(50));
    const [yState, setY] = useQueryState('y', parseAsInteger.withDefault(50));
    const resolvedFormat = formatState;
    const resolvedShowPhoto = hasPhoto && photoState === '1';
    const resolvedLang = langState;
    const resolvedCrop = {
        x: parseSharepicPosition(xState.toString()),
        y: parseSharepicPosition(yState.toString()),
        zoom: parseSharepicZoom(zoomState.toString()),
    };
    const [previewCrop, setPreviewCrop] = useState(resolvedCrop);
    const previewSrc = sharepicImagePath(id, resolvedFormat, resolvedShowPhoto, resolvedLang, previewCrop);
    const downloadHref = sharepicImagePath(id, resolvedFormat, resolvedShowPhoto, resolvedLang, resolvedCrop, true);
    const { height, width } = sharepicFormats[resolvedFormat];
    const [readySrc, setReadySrc] = useState<string | null>(null);
    const previewReady = readySrc === previewSrc;

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setPreviewCrop(resolvedCrop);
        }, 250);

        return () => window.clearTimeout(timeout);
    }, [resolvedCrop.x, resolvedCrop.y, resolvedCrop.zoom]);

    const markPreviewReady = useCallback(() => {
        setReadySrc(previewSrc);
    }, [previewSrc]);

    const previewRef = useCallback(
        (image: HTMLImageElement | null) => {
            if (image?.complete) {
                setReadySrc(previewSrc);
            }
        },
        [previewSrc],
    );

    const selectFeed = useCallback(() => {
        void setFormat('feed');
    }, [setFormat]);

    const selectStory = useCallback(() => {
        void setFormat('story');
    }, [setFormat]);

    const selectPhotoOn = useCallback(() => {
        void setPhoto('1');
    }, [setPhoto]);

    const selectPhotoOff = useCallback(() => {
        void setPhoto('0');
    }, [setPhoto]);

    const selectGerman = useCallback(() => {
        void setLang('de');
    }, [setLang]);

    const selectEnglish = useCallback(() => {
        void setLang('en');
    }, [setLang]);

    const updateZoom = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            void setZoom(Number(event.target.value));
        },
        [setZoom],
    );

    const updateX = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            void setX(Number(event.target.value));
        },
        [setX],
    );

    const updateY = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            void setY(Number(event.target.value));
        },
        [setY],
    );

    return (
        <div className="min-h-screen font-display text-[#2C2E83]">
            <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10 md:py-16">
                <p className="text-xs font-bold tracking-[0.2em] text-[#EA504C] uppercase">B-Side Festival 2026</p>
                <h1 className="mt-3 text-4xl leading-none font-black sm:text-5xl">Sharepic</h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed font-medium">
                    Vorschau und Download für Instagram. Wähle Format, Foto und Sprache, dann speichere das Bild.
                </p>
                {canceled && <p className="mt-3 font-black">Dieser Beitrag fällt aus — das Sharepic zeigt den Hinweis.</p>}

                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
                    <div
                        aria-busy={!previewReady}
                        aria-label={previewReady ? `Sharepic ${name}` : 'Sharepic wird geladen'}
                        className="relative flex min-h-80 items-center justify-center bg-[#f4b6d6]/40 p-4 sm:p-6"
                    >
                        {!previewReady && <FontAwesomeIcon className="size-8 animate-spin text-[#2C2E83]" icon={faSpinner} />}
                        <img
                            alt={`Sharepic ${name}`}
                            className={cn('max-h-[70vh] w-auto rounded-sm bg-white shadow-md', !previewReady && 'hidden')}
                            height={height}
                            key={previewSrc}
                            onError={markPreviewReady}
                            onLoad={markPreviewReady}
                            ref={previewRef}
                            src={previewSrc}
                            width={width}
                        />
                    </div>

                    <div className="space-y-6 bg-white p-6 text-[#2C2E83]">
                        <div>
                            <div className="text-sm font-black">Format</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <button className={optionClassName(resolvedFormat === 'feed')} onClick={selectFeed} type="button">
                                    Feed 4:5
                                </button>
                                <button className={optionClassName(resolvedFormat === 'story')} onClick={selectStory} type="button">
                                    Story 9:16
                                </button>
                            </div>
                        </div>

                        {hasPhoto && (
                            <div>
                                <div className="text-sm font-black">Foto</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <button className={optionClassName(resolvedShowPhoto)} onClick={selectPhotoOn} type="button">
                                        Foto an
                                    </button>
                                    <button className={optionClassName(!resolvedShowPhoto)} onClick={selectPhotoOff} type="button">
                                        Foto aus
                                    </button>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="text-sm font-black">Sprache</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <button className={optionClassName(resolvedLang === 'de')} onClick={selectGerman} type="button">
                                    Deutsch
                                </button>
                                <button className={optionClassName(resolvedLang === 'en')} onClick={selectEnglish} type="button">
                                    English
                                </button>
                            </div>
                        </div>

                        {resolvedShowPhoto && (
                            <div className="space-y-4">
                                <div className="text-sm font-black">Foto-Ausschnitt</div>
                                <label className="block text-sm font-bold" htmlFor="sharepic-zoom">
                                    Zoom <span className="font-normal">{zoomState.toFixed(1)}×</span>
                                </label>
                                <input
                                    aria-label="Zoom"
                                    className="w-full accent-[#2C2E83]"
                                    id="sharepic-zoom"
                                    max={sharepicZoomMax}
                                    min={1}
                                    onChange={updateZoom}
                                    step={0.1}
                                    type="range"
                                    value={zoomState}
                                />
                                <label className="block text-sm font-bold" htmlFor="sharepic-x">
                                    Horizontal <span className="font-normal">{xState}%</span>
                                </label>
                                <input
                                    aria-label="Horizontale Position"
                                    className="w-full accent-[#2C2E83]"
                                    id="sharepic-x"
                                    max={100}
                                    min={0}
                                    onChange={updateX}
                                    step={1}
                                    type="range"
                                    value={xState}
                                />
                                <label className="block text-sm font-bold" htmlFor="sharepic-y">
                                    Vertikal <span className="font-normal">{yState}%</span>
                                </label>
                                <input
                                    aria-label="Vertikale Position"
                                    className="w-full accent-[#2C2E83]"
                                    id="sharepic-y"
                                    max={100}
                                    min={0}
                                    onChange={updateY}
                                    step={1}
                                    type="range"
                                    value={yState}
                                />
                            </div>
                        )}

                        <a
                            className="inline-flex bg-[#2C2E83] px-5 py-3 font-black text-white no-underline hover:bg-black"
                            href={downloadHref}
                        >
                            Bild herunterladen
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharepicStudio;
