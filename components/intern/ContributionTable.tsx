'use client';

import { useInternWorkspaceContext } from '@/components/intern/InternWorkspaceContext';
import StatusBadge from '@/components/intern/StatusBadge';
import formatDate from '@/lib/common/helper/formatDate';
import type { InternListSortColumn } from '@/lib/intern/internFilterSearchParams';
import { withSearchParams } from '@/lib/intern/internFilterSearchParams';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import type { SerializableListParticipant } from '@/typings/SerializableListParticipant';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ReactElement } from 'react';
import { useCallback } from 'react';

const SortHeaderButton = ({
    column,
    label,
    className,
}: {
    className?: string;
    column: InternListSortColumn;
    label: string;
}): ReactElement => {
    const { sortColumn, sortDirection, toggleSort } = useInternWorkspaceContext();
    const isActive = sortColumn === column;
    const handleClick = useCallback(() => toggleSort(column), [column, toggleSort]);

    return (
        <button type="button" className={`inline-flex items-center gap-1 font-bold uppercase ${className ?? ''}`} onClick={handleClick}>
            <span>{label}</span>
            <span aria-hidden className="text-[10px] text-black/50">
                {isActive ? (sortDirection === 'asc' ? '▲' : '▼') : '◇'}
            </span>
        </button>
    );
};

const ContributionTableRow = ({ application }: { application: SerializableListParticipant }): ReactElement => {
    const searchParams = useSearchParams();
    const detailHref = withSearchParams(`/intern/${application.id}`, searchParams);
    const typeLabel = typeLabels[application.type];
    const typeColor = typeColors[application.type];

    return (
        <tr className="group relative border-t border-black/15 transition-colors duration-150 hover:bg-black/[0.04]">
            <td className="px-2.5 py-2 align-top">
                <span className="line-clamp-2 text-base leading-snug font-semibold">{application.name}</span>
            </td>
            <td className="w-28 max-w-28 px-2 py-2 align-top">
                <span
                    className="inline-block max-w-full truncate rounded border border-black/20 px-1.5 py-0.5 text-xs font-bold"
                    style={{ backgroundColor: typeColor }}
                    title={typeLabel}
                >
                    {typeLabel}
                </span>
            </td>
            <td className="px-2.5 py-2 align-top whitespace-nowrap">
                <StatusBadge status={application.status} />
            </td>
            <td className="px-2.5 py-2 align-top text-sm whitespace-nowrap">
                {application.earliestSlot === null ? (
                    <span className="text-black/40">kein Slot</span>
                ) : (
                    <span>
                        {application.earliestSlot.locationName}
                        {application.earliestSlot.additionalSlotCount > 0 ? (
                            <span className="ml-1 text-black/40">+{application.earliestSlot.additionalSlotCount}</span>
                        ) : null}
                    </span>
                )}
            </td>
            <td className="px-2.5 py-2 align-top text-sm whitespace-nowrap">
                {application.earliestSlot === null ? <span className="text-black/40">—</span> : application.earliestSlot.timeLabel}
            </td>
            <td className="px-2.5 py-2 align-top text-sm whitespace-nowrap tabular-nums">
                {application.feeEuros === null ? <span className="text-black/40">—</span> : `${application.feeEuros} €`}
            </td>
            <td className="px-2.5 py-2 align-top text-sm text-black/70">
                {application.lastComment === null ? (
                    <span className="text-black/40">—</span>
                ) : (
                    <div
                        title={`${application.lastComment.authorName} · ${formatDate(application.lastComment.createdAt, 'dd.MM.yy HH:mm')}\n${application.lastComment.text}`}
                    >
                        <div className="line-clamp-2">{application.lastComment.text}</div>
                    </div>
                )}
            </td>
            <td className="w-10 px-2 py-2 text-center align-middle">
                <Link href={detailHref} className="absolute inset-0 z-10" aria-label={`Details zu ${application.name}`} />
                <span
                    aria-hidden
                    className="inline-block text-xl leading-none text-black/30 transition-all duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-black"
                >
                    ›
                </span>
            </td>
        </tr>
    );
};

const ContributionTable = (): ReactElement => {
    const { filteredApplications } = useInternWorkspaceContext();

    return (
        <div className="overflow-x-auto rounded-md border border-black bg-white/90 shadow-lg backdrop-blur-2xl">
            <table className="min-w-full table-fixed border-collapse text-left">
                <colgroup>
                    <col className="w-[16%]" />
                    <col className="w-[9%]" />
                    <col className="w-[11%]" />
                    <col className="w-[13%]" />
                    <col className="w-[13%]" />
                    <col className="w-[7%]" />
                    <col />
                    <col className="w-10" />
                </colgroup>
                <thead className="bg-black/[0.04] text-xs tracking-wide text-black/70">
                    <tr>
                        <th className="px-2.5 py-2.5">
                            <SortHeaderButton column="name" label="Name" />
                        </th>
                        <th className="px-2 py-2.5 font-bold uppercase">Typ</th>
                        <th className="px-2.5 py-2.5">
                            <SortHeaderButton column="status" label="Status" />
                        </th>
                        <th className="px-2.5 py-2.5">
                            <SortHeaderButton column="location" label="Ort" />
                        </th>
                        <th className="px-2.5 py-2.5">
                            <SortHeaderButton column="time" label="Zeit" />
                        </th>
                        <th className="px-2.5 py-2.5">
                            <SortHeaderButton column="fee" label="Gage" />
                        </th>
                        <th className="px-2.5 py-2.5 font-bold uppercase">Kommentar</th>
                        <th className="w-10 px-2 py-2.5">
                            <span className="sr-only">Öffnen</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApplications.map((application) => (
                        <ContributionTableRow key={application.id} application={application} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContributionTable;
