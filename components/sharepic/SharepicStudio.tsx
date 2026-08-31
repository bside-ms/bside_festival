'use client';

import cn from '@/lib/common/helper/cn';
import useIsMounted from '@/lib/common/hooks/useIsMounted';
import { sharepicFormats, sharepicImagePath, type SharepicFormat, type SharepicLang } from '@/lib/sharepic/sharepicFormats';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import type { ReactElement } from 'react';
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
    const resolvedFormat = formatState;
    const resolvedShowPhoto = hasPhoto && photoState === '1';
    const resolvedLang = langState;
    const previewSrc = sharepicImagePath(id, resolvedFormat, resolvedShowPhoto, resolvedLang);
    const downloadHref = sharepicImagePath(id, resolvedFormat, resolvedShowPhoto, resolvedLang, true);
    const { height, width } = sharepicFormats[resolvedFormat];
    const hasMounted = useIsMounted();
    const [previewReady, setPreviewReady] = useState(false);

    useEffect(() => {
        if (!hasMounted) {
            return;
        }

        setPreviewReady(false);
    }, [hasMounted, previewSrc]);

    const markPreviewReady = useCallback(() => {
        setPreviewReady(true);
    }, []);

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
                    <div className="relative flex min-h-80 justify-center bg-[#f4b6d6]/40 p-4 sm:p-6">
                        {hasMounted && !previewReady && <div className="absolute inset-0 animate-pulse bg-[#f4b6d6]/80" />}
                        <img
                            alt={`Sharepic ${name}`}
                            className="max-h-[70vh] w-auto rounded-sm bg-white shadow-md"
                            height={height}
                            key={previewSrc}
                            onLoad={markPreviewReady}
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
