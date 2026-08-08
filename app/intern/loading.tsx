import cn from '@/lib/common/helper/cn';
import { range } from 'lodash';
import type { ReactElement } from 'react';

const FilterPillSkeleton = ({ widthClass }: { widthClass: string }): ReactElement => (
    <div className={cn('h-5 rounded bg-gray-200', widthClass)} />
);

const TableRowSkeleton = (): ReactElement => (
    <tr className="border-t border-black/10">
        <td className="px-2 py-1.5">
            <div className="h-4 w-32 max-w-full rounded bg-gray-300" />
        </td>
        <td className="px-1.5 py-1.5">
            <div className="h-4 w-12 rounded bg-gray-200" />
        </td>
        <td className="px-2 py-1.5">
            <div className="h-4 w-20 rounded bg-gray-200" />
        </td>
        <td className="px-2 py-1.5">
            <div className="h-4 w-24 rounded bg-gray-200" />
        </td>
        <td className="px-2 py-1.5">
            <div className="h-4 w-28 rounded bg-gray-200" />
        </td>
        <td className="px-2 py-1.5">
            <div className="h-4 w-10 rounded bg-gray-200" />
        </td>
        <td className="px-2 py-1.5">
            <div className="h-8 w-full rounded bg-gray-200" />
        </td>
        <td className="px-2 py-1.5">
            <div className="mx-auto h-4 w-3 rounded bg-gray-200" />
        </td>
    </tr>
);

const Loading = (): ReactElement => (
    <div className="relative mx-auto min-h-screen w-full max-w-[90rem] animate-pulse px-2 pt-5 pb-3">
        <div className="space-y-4">
            <div>
                <div className="h-10 w-72 max-w-full rounded bg-gray-300" />
                <div className="mt-2 h-4 w-28 rounded bg-gray-200" />
            </div>

            <div className="space-y-2 rounded-md border border-black bg-white/80 p-3 shadow-lg backdrop-blur-2xl">
                <div className="flex flex-wrap items-center gap-1.5">
                    <div className="h-6 w-44 rounded border border-black/10 bg-gray-100" />
                    <FilterPillSkeleton widthClass="w-24" />
                    <FilterPillSkeleton widthClass="w-28" />
                </div>
                <div className="flex flex-wrap items-center gap-1">
                    <div className="h-3 w-10 rounded bg-gray-300" />
                    {range(6).map((n) => (
                        <FilterPillSkeleton key={n} widthClass="w-16" />
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                    <div className="h-3 w-10 rounded bg-gray-300" />
                    {range(5).map((n) => (
                        <FilterPillSkeleton key={n} widthClass="w-20" />
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-md border border-black bg-white/90 shadow-lg">
                <table className="min-w-full border-collapse">
                    <thead className="bg-black/[0.04]">
                        <tr>
                            {range(8).map((n) => (
                                <th key={n} className="px-2 py-2 text-left">
                                    <div className="h-3 w-14 rounded bg-gray-300" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {range(8).map((n) => (
                            <TableRowSkeleton key={n} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default Loading;
