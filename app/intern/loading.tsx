import cn from '@/lib/common/helper/cn';
import { range } from 'lodash';
import type { ReactElement } from 'react';

const FilterPillSkeleton = ({ widthClass }: { widthClass: string }): ReactElement => (
    <div className={cn('h-7 rounded-full bg-gray-200', widthClass)} />
);

const ContributionCardSkeleton = (): ReactElement => (
    <div className="overflow-hidden rounded-md border border-black bg-white shadow-sm">
        <div className="grid gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="h-6 w-20 rounded bg-gray-200" />
                    <div className="h-6 w-16 rounded bg-gray-200" />
                </div>
                <div className="h-7 w-3/4 max-w-md rounded bg-gray-300" />
                <div className="h-3 w-36 rounded bg-gray-200" />
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border border-black/20 bg-gray-200" />
                    <div className="h-8 w-8 rounded-full border border-black/20 bg-gray-200" />
                </div>
                <div className="h-9 w-28 rounded bg-gray-200" />
            </div>
        </div>
    </div>
);

const StatusGroupSkeleton = ({ cardCount }: { cardCount: number }): ReactElement => (
    <section className="overflow-hidden rounded-md border border-black bg-white/70 shadow-lg backdrop-blur-2xl">
        <div className="flex w-full items-center justify-between gap-3 border-b border-black bg-gray-100 p-3">
            <div className="flex items-center gap-2">
                <div className="h-6 w-28 rounded bg-gray-300" />
                <div className="h-5 w-8 rounded-full bg-gray-200" />
            </div>
            <div className="h-5 w-5 rounded bg-gray-300" />
        </div>
        <div className="space-y-3 p-3">
            {range(cardCount).map((n) => (
                <ContributionCardSkeleton key={n} />
            ))}
        </div>
    </section>
);

const Loading = (): ReactElement => (
    <div className="relative mx-auto min-h-screen w-full max-w-7xl animate-pulse px-2 pt-5 pb-3">
        <div className="space-y-5">
            <div>
                <div className="h-12 w-72 max-w-full rounded bg-gray-300" />
                <div className="mt-2 h-4 w-28 rounded bg-gray-200" />
            </div>

            <div className="rounded-md border border-black bg-white/80 p-4 shadow-lg backdrop-blur-2xl">
                <div className="h-4 w-14 rounded bg-gray-300" />
                <div className="mt-1 h-12 w-full rounded border border-black/10 bg-gray-100" />

                <div className="mt-4">
                    <div className="mb-2 h-4 w-16 rounded bg-gray-300" />
                    <div className="flex flex-wrap gap-2">
                        <FilterPillSkeleton widthClass="w-28" />
                        <FilterPillSkeleton widthClass="w-32" />
                    </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                        <div className="mb-2 h-4 w-10 rounded bg-gray-300" />
                        <div className="flex flex-wrap gap-2">
                            {range(6).map((n) => (
                                <FilterPillSkeleton key={n} widthClass="w-20" />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 h-4 w-14 rounded bg-gray-300" />
                        <div className="flex flex-wrap gap-2">
                            {range(5).map((n) => (
                                <FilterPillSkeleton key={n} widthClass="w-24" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <StatusGroupSkeleton cardCount={3} />
            <StatusGroupSkeleton cardCount={2} />
        </div>
    </div>
);

export default Loading;
