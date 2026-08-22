'use client';

import { programListVisitStorageKey } from '@/components/participants/publicProgram/ProgramBackLink';
import ProgramEntryCard from '@/components/participants/publicProgram/ProgramEntryCard';
import publicProgramSections, { type PublicProgramSection } from '@/lib/participants/publicProgramSections';
import type PublicProgramEntry from '@/typings/PublicProgramEntry';
import { deburr } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ChangeEvent, ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface SectionWithParticipants {
    participants: Array<PublicProgramEntry>;
    section: PublicProgramSection;
}

interface Props {
    initialSearchText: string;
    participants: Array<PublicProgramEntry>;
}

const normalize = (value: string): string => deburr(value).toLocaleLowerCase('de-DE');

const PublicProgramCatalog = ({ initialSearchText, participants }: Props): ReactElement => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchText, setSearchText] = useState(initialSearchText);
    const [sectionColor, setSectionColor] = useState(publicProgramSections[0]?.color ?? '#D681B4');

    const sections = useMemo<Array<SectionWithParticipants>>(() => {
        const query = normalize(searchText.trim());
        const shownParticipants =
            query === '' ? participants : participants.filter((participant) => normalize(participant.name).includes(query));

        return publicProgramSections
            .map((section) => ({
                participants: shownParticipants
                    .filter((participant) => section.types.includes(participant.type))
                    .sort((left, right) => left.name.localeCompare(right.name, 'de-DE', { sensitivity: 'base' })),
                section,
            }))
            .filter(({ participants: sectionParticipants }) => sectionParticipants.length > 0);
    }, [participants, searchText]);

    const updateActiveSection = useCallback(() => {
        const threshold = 72;
        const activeSection = sections.reduce<SectionWithParticipants | undefined>((current, item) => {
            const element = document.getElementById(`program-section-${item.section.id}`);
            return element !== null && element.getBoundingClientRect().top <= threshold ? item : current;
        }, undefined);

        setSectionColor((activeSection ?? sections[0])?.section.color ?? '#D681B4');
    }, [sections]);

    useEffect(() => {
        updateActiveSection();
        window.addEventListener('scroll', updateActiveSection, { passive: true });
        window.addEventListener('resize', updateActiveSection);

        return () => {
            window.removeEventListener('scroll', updateActiveSection);
            window.removeEventListener('resize', updateActiveSection);
        };
    }, [updateActiveSection]);

    useEffect(() => {
        sessionStorage.setItem(programListVisitStorageKey, '1');
    }, []);

    const searchParamsString = searchParams.toString();

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const query = searchText.trim();

        if (query === '') {
            params.delete('text');
        } else {
            params.set('text', searchText);
        }

        const queryString = params.toString();
        const nextUrl = queryString === '' ? '/programm' : `/programm?${queryString}`;
        const currentUrl = searchParamsString === '' ? '/programm' : `/programm?${searchParamsString}`;

        if (nextUrl === currentUrl) {
            return;
        }

        router.replace(nextUrl, { scroll: false });
    }, [router, searchParamsString, searchText]);

    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value), []);
    const handleClear = useCallback(() => setSearchText(''), []);

    return (
        <div
            className="min-h-screen font-display text-[#2C2E83] transition-colors duration-200 motion-reduce:transition-none"
            style={{ backgroundColor: sectionColor }}
        >
            <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-6">
                <div className="max-w-3xl">
                    <div className="text-xs font-bold tracking-[0.2em] text-[#EA504C] uppercase">B-Side Festival 2026</div>
                    <h1 className="mt-2 text-4xl leading-[0.9] font-black text-white sm:text-5xl md:text-6xl">Programm</h1>
                </div>

                <div className="relative mt-5 max-w-xl">
                    <label className="sr-only" htmlFor="program-search">
                        Programm durchsuchen
                    </label>
                    <input
                        id="program-search"
                        type="search"
                        value={searchText}
                        onChange={handleSearchChange}
                        placeholder="Programm durchsuchen"
                        className="w-full rounded-sm bg-white px-5 py-3 pr-12 text-base font-semibold text-[#2C2E83] outline-offset-4 placeholder:text-[#2C2E83]/60 focus-visible:outline-4 focus-visible:outline-[#2C2E83]"
                    />
                    {searchText !== '' && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute top-1/2 right-3 -translate-y-1/2 p-2 font-black text-[#2C2E83] focus-visible:outline-4 focus-visible:outline-[#2C2E83]"
                            aria-label="Suche löschen"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {sections.length === 0 ? (
                <div className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
                    <p className="text-2xl font-black text-white">Keine Programmbeiträge gefunden.</p>
                </div>
            ) : (
                <div className="pb-20">
                    {sections.map(({ participants: sectionParticipants, section }) => (
                        <section
                            key={section.id}
                            id={`program-section-${section.id}`}
                            className="scroll-mt-18"
                            aria-labelledby={`program-section-title-${section.id}`}
                        >
                            <div
                                className="sticky top-15 z-20 border-y border-[#2C2E83]/20 transition-colors duration-200 motion-reduce:transition-none"
                                style={{ backgroundColor: sectionColor }}
                            >
                                <div className="mx-auto w-full max-w-6xl px-6 py-4 md:px-10 md:py-5">
                                    <h2
                                        id={`program-section-title-${section.id}`}
                                        className="text-3xl leading-none font-black md:text-5xl"
                                        style={{ color: section.foregroundColor }}
                                    >
                                        {section.label}
                                    </h2>
                                </div>
                            </div>
                            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-2 md:px-10 lg:grid-cols-3 xl:grid-cols-4">
                                {sectionParticipants.map((participant) => (
                                    <ProgramEntryCard key={participant.id} participant={participant} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicProgramCatalog;
