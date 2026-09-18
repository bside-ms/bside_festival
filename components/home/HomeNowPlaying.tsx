'use client';

import cn from '@/lib/common/helper/cn';
import type { NowPlayingData, NowPlayingSection } from '@/lib/public/getHomeNowPlaying';
import Link from 'next/link';
import { useCallback, useLayoutEffect, useRef, useState, type ReactElement } from 'react';
import { FaChevronDown } from 'react-icons/fa';

type Props = {
    nowPlaying: NowPlayingData;
};

const NowPlayingSectionList = ({ groups, idPrefix }: { groups: Array<NowPlayingSection>; idPrefix: string }): ReactElement => (
    <div className="space-y-3">
        {groups.map((group) => (
            <section key={group.id} aria-labelledby={`${idPrefix}-${group.id}`}>
                <h3
                    id={`${idPrefix}-${group.id}`}
                    className="text-[0.7rem] font-bold tracking-[0.18em] uppercase"
                    style={{ color: group.color }}
                >
                    {group.label}
                </h3>
                <ul className="mt-1.5 space-y-1.5">
                    {group.appearances.map((appearance) => (
                        <li key={appearance.id}>
                            <Link
                                href={`/programm/${appearance.participantId}`}
                                className="group flex items-center gap-3 rounded-sm bg-[#2C2E83]/5 px-2.5 py-2 no-underline transition hover:bg-[#2C2E83]/12 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#2C2E83]"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="font-black wrap-anywhere">{appearance.name}</div>
                                    <div className="mt-0.5 text-sm font-medium text-[#2C2E83]/80">
                                        {appearance.typeLabel} · {appearance.locationName} · {appearance.when}
                                    </div>
                                </div>
                                <span
                                    aria-hidden={true}
                                    className="shrink-0 text-sm font-black text-[#2C2E83]/45 transition-transform group-hover:translate-x-0.5 group-hover:text-[#2C2E83] motion-reduce:transition-none"
                                >
                                    →
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        ))}
    </div>
);

const HomeNowPlaying = ({ nowPlaying }: Props): ReactElement => {
    const hasNow = nowPlaying.now.length > 0;
    const hasUpcoming = nowPlaying.upcoming.length > 0;
    const [upcomingOpen, setUpcomingOpen] = useState(!hasNow && hasUpcoming);
    const skipInitialScroll = useRef(true);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const upcomingRef = useRef<HTMLDivElement>(null);
    const toggleUpcoming = useCallback(() => setUpcomingOpen((open) => !open), []);

    useLayoutEffect(() => {
        if (skipInitialScroll.current) {
            skipInitialScroll.current = false;
            return;
        }

        if (!upcomingOpen) {
            return;
        }

        const scroller = scrollerRef.current;
        const upcoming = upcomingRef.current;

        if (scroller === null || upcoming === null) {
            return;
        }

        const top = upcoming.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
        scroller.scrollTo({ top });
    }, [upcomingOpen]);

    return (
        <aside className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-4 pb-4 md:px-6 md:pb-6" aria-label="Was läuft gerade?">
            <div className="mx-auto w-full max-w-300">
                <div
                    ref={scrollerRef}
                    className="pointer-events-auto max-h-[min(22rem,42dvh)] max-w-lg overflow-y-auto rounded-sm bg-white/92 text-[#2C2E83] shadow-[0_12px_40px_rgba(44,46,131,0.18)] backdrop-blur-sm"
                >
                    <div className="p-4 md:p-5">
                        <div className="flex items-center gap-2">
                            {hasNow && (
                                <span className="relative flex size-2.5 shrink-0" aria-hidden={true}>
                                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#EA504C] opacity-70 motion-reduce:hidden" />
                                    <span className="relative inline-flex size-2.5 rounded-full bg-[#EA504C]" />
                                </span>
                            )}
                            <h2 className="text-lg font-black">Was läuft gerade?</h2>
                        </div>

                        {hasNow ? (
                            <div className="mt-3">
                                <NowPlayingSectionList groups={nowPlaying.now} idPrefix="now-playing" />
                            </div>
                        ) : (
                            <p className="mt-2 text-sm font-medium">Gerade läuft nichts.</p>
                        )}

                        {hasUpcoming && (
                            <div ref={upcomingRef} className={cn('mt-4', hasNow && 'border-t border-[#2C2E83]/15 pt-3')}>
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between gap-3 text-left"
                                    aria-expanded={upcomingOpen}
                                    aria-controls="now-playing-upcoming"
                                    onClick={toggleUpcoming}
                                >
                                    <span className="text-lg font-black">Als Nächstes</span>
                                    <FaChevronDown
                                        aria-hidden={true}
                                        className={cn(
                                            'size-3.5 shrink-0 transition-transform motion-reduce:transition-none',
                                            upcomingOpen && 'rotate-180',
                                        )}
                                    />
                                </button>
                                {upcomingOpen && (
                                    <div id="now-playing-upcoming" className="mt-3">
                                        <NowPlayingSectionList groups={nowPlaying.upcoming} idPrefix="now-playing-upcoming" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default HomeNowPlaying;
