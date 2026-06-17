'use client';

import ApplicationJuryVotesEditor from '@/components/applications/applicationCuration/ApplicationJuryVotesEditor';
import { ApplicationNameForm } from '@/components/applications/applicationCuration/ApplicationNameAndDescriptionForm';
import ApplicationDetails from '@/components/applications/applicationDetails/ApplicationDetails';
import StatusTransitionPanel from '@/components/intern/StatusTransitionPanel';
import Badge from '@/components/participants/details/Badge';
import { updateApplicationPastParticipation } from '@/lib/actions/applicationActions';
import { calculateCurationScores, formatCurationScore, isLocalZipcode, localZipcodePrefixes } from '@/lib/applications/curationScoring';
import cn from '@/lib/common/helper/cn';
import typeLabels from '@/lib/participants/typeLabels';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { Genre, Link, ParticipantGenre, Type, Zipcode } from '@prisma/client';
import { orderBy, xor } from 'lodash';
import NextLink from 'next/link';
import type { ChangeEvent, MouseEvent, ReactElement } from 'react';
import { Fragment, useCallback, useEffect, useMemo, useState, useTransition } from 'react';

type CurationStateFilter = 'all' | 'curated' | 'open';
type SortOption =
    | 'applied-asc'
    | 'applied-desc'
    | 'name-asc'
    | 'jury-asc'
    | 'jury-desc'
    | 'bonus-asc'
    | 'bonus-desc'
    | 'final-asc'
    | 'final-desc';

interface Props {
    applications: Array<SerializableParticipant>;
    participantGenres: Array<ParticipantGenre>;
    allLinks: Array<Link>;
    allZipcodes: Array<Zipcode>;
    allGenres: Array<Genre>;
}

interface ApplicationRow {
    application: SerializableParticipant;
    genres: Array<Genre>;
    links: Array<Link>;
    zipcodes: Array<Zipcode>;
    scores: ReturnType<typeof calculateCurationScores>;
}

const curationStateOptions: Array<{ value: CurationStateFilter; label: string }> = [
    { value: 'all', label: 'Alle' },
    { value: 'open', label: 'Offen' },
    { value: 'curated', label: 'Kuratiert' },
];

const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: 'applied-asc', label: 'Bewerbungszeit: alt zuerst' },
    { value: 'applied-desc', label: 'Bewerbungszeit: neu zuerst' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'jury-desc', label: 'Jury: hoch zuerst' },
    { value: 'jury-asc', label: 'Jury: niedrig zuerst' },
    { value: 'bonus-desc', label: 'Bonus: hoch zuerst' },
    { value: 'bonus-asc', label: 'Bonus: niedrig zuerst' },
    { value: 'final-desc', label: 'Final: hoch zuerst' },
    { value: 'final-asc', label: 'Final: niedrig zuerst' },
];

const allTypes = Object.keys(typeLabels) as Array<Type>;
const scoreSortOptions = new Set<SortOption>(['jury-asc', 'jury-desc', 'bonus-asc', 'bonus-desc', 'final-asc', 'final-desc']);

const formatAppliedAt = (appliedAt: string | null): string => {
    if (appliedAt === null) {
        return 'ohne Datum';
    }

    return new Date(appliedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const getSortValue = ({ application, scores }: ApplicationRow, sortOption: SortOption): number | string => {
    switch (sortOption) {
        case 'applied-asc':
        case 'applied-desc':
            return application.appliedAt === null ? 0 : new Date(application.appliedAt).getTime();
        case 'name-asc':
            return application.name.toLocaleLowerCase('de-DE');
        case 'jury-asc':
        case 'jury-desc':
            return scores.juryScore ?? 0;
        case 'bonus-asc':
        case 'bonus-desc':
            return scores.bonusScore;
        case 'final-asc':
        case 'final-desc':
            return scores.finalScore ?? 0;
    }
};

const getSortDirection = (sortOption: SortOption): 'asc' | 'desc' => {
    return sortOption.endsWith('desc') ? 'desc' : 'asc';
};

const isCurated = ({ application }: ApplicationRow): boolean => {
    return application.juryVotes !== null && application.juryVotes.length > 0;
};

const ScoreCell = ({ value }: { value: number | null }): ReactElement => (
    <span className={cn('tabular-nums', value === null && 'text-gray-400')}>
        {value === null
            ? formatCurationScore(value)
            : value.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}
    </span>
);
const scoreCellClassName = 'w-20 p-2 text-right align-middle';
const finalScoreCellClassName = 'w-20 py-2 pr-4 pl-2 text-right align-middle';

const ApplicationTextBlock = ({ title, children }: { title: string; children: string | null | undefined }): ReactElement | null => {
    if (children === null || children === undefined || children.trim().length === 0) {
        return null;
    }

    return (
        <div>
            <div className="font-display text-lg">{title}</div>
            <div className="whitespace-pre-wrap">{children}</div>
        </div>
    );
};

const FilterToggleButton = <T extends string>({
    isActive,
    label,
    onToggle,
    value,
}: {
    isActive: boolean;
    label: string;
    onToggle: (value: T) => void;
    value: T;
}): ReactElement => {
    const handleClick = useCallback(() => onToggle(value), [onToggle, value]);

    return (
        <button
            type="button"
            className={cn('rounded-full border border-black px-3 py-1 text-xs', isActive ? 'bg-black text-white' : 'bg-white/60')}
            onClick={handleClick}
        >
            {label}
        </button>
    );
};

const ApplicationDetailsOverlay = ({ onClose, row }: { onClose: () => void; row: ApplicationRow }): ReactElement => {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const handleContentClick = useCallback((event: MouseEvent<HTMLDivElement>) => event.stopPropagation(), []);

    return (
        <div className="fixed inset-0 z-50 bg-black/40 p-3 backdrop-blur-sm md:p-6" onClick={onClose}>
            <div className="ml-auto h-full max-w-5xl overflow-y-auto rounded-md bg-white shadow-2xl" onClick={handleContentClick}>
                <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black bg-white px-4 py-3">
                    <ApplicationNameForm application={row.application} />
                    <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded border border-black bg-white font-display text-xl hover:bg-yellow-50"
                        onClick={onClose}
                        aria-label="Bewerbungsdetails schließen"
                    >
                        ×
                    </button>
                </div>

                <ApplicationDetails
                    application={row.application}
                    genres={row.genres}
                    links={row.links}
                    zipcodes={row.zipcodes}
                    onCloseClick={onClose}
                    showName={false}
                    showBottomClose={false}
                />
            </div>
        </div>
    );
};

const ApplicationCurationRow = ({
    isExpanded,
    onShowDetails,
    onToggleExpanded,
    row,
}: {
    isExpanded: boolean;
    onShowDetails: (id: number) => void;
    onToggleExpanded: (id: number) => void;
    row: ApplicationRow;
}): ReactElement => {
    const { application, genres, links, scores, zipcodes } = row;
    const typeLabel = typeLabels[application.type];
    const privateLinks = links.filter(({ isConfidential }) => isConfidential);
    const publicLinks = links.filter(({ isConfidential }) => !isConfidential);
    const localZipcodeCount = zipcodes.filter(isLocalZipcode).length;

    const [isPending, startTransition] = useTransition();

    const handleToggleExpanded = useCallback(() => onToggleExpanded(application.id), [application.id, onToggleExpanded]);
    const handleShowDetails = useCallback(() => onShowDetails(application.id), [application.id, onShowDetails]);
    const handleStatusCellClick = useCallback((event: MouseEvent<HTMLTableCellElement>) => event.stopPropagation(), []);

    const handlePastParticipationChange = useCallback(
        (value: 'unknown' | 'yes' | 'no') => {
            startTransition(async () => {
                try {
                    await updateApplicationPastParticipation(application.id, { hasParticipatedBefore: value });
                } catch (error) {
                    console.error('Failed to update past participation', error);
                }
            });
        },
        [application.id],
    );

    const handlePastParticipationUnknown = useCallback(() => handlePastParticipationChange('unknown'), [handlePastParticipationChange]);
    const handlePastParticipationNo = useCallback(() => handlePastParticipationChange('no'), [handlePastParticipationChange]);
    const handlePastParticipationYes = useCallback(() => handlePastParticipationChange('yes'), [handlePastParticipationChange]);

    return (
        <Fragment>
            <tr className={cn('border-t border-black/20', !isCurated(row) && 'bg-amber-50/70')}>
                <td className="cursor-pointer py-2 pr-2 pl-4 align-middle">
                    <button
                        type="button"
                        className="group flex w-full cursor-pointer items-center gap-2 rounded p-1 text-left hover:bg-black/5"
                        onClick={handleToggleExpanded}
                    >
                        <span className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border border-black bg-white font-display text-sm leading-none group-hover:bg-yellow-100">
                            {isExpanded ? '−' : '+'}
                        </span>
                        <span className="cursor-pointer font-display text-lg leading-tight group-hover:underline">{application.name}</span>
                    </button>
                </td>
                <td className="w-24 max-w-24 p-2 align-middle text-xs text-gray-600">
                    <span className="block truncate" title={typeLabel}>
                        {typeLabel}
                    </span>
                </td>
                <td className="w-56 p-2 align-middle" onClick={handleStatusCellClick}>
                    <StatusTransitionPanel currentStatus={application.status} participantId={application.id} />
                </td>
                <td className={scoreCellClassName}>
                    <ScoreCell value={scores.bonusParts.flinta} />
                </td>
                <td className={scoreCellClassName}>
                    <ScoreCell value={scores.bonusParts.marginalized} />
                </td>
                <td className={scoreCellClassName}>
                    <ScoreCell value={scores.bonusParts.firstTime} />
                </td>
                <td className={scoreCellClassName}>
                    <ScoreCell value={scores.bonusParts.local} />
                </td>
                <td className={cn(scoreCellClassName, 'font-bold')}>
                    <ScoreCell value={scores.bonusScore} />
                </td>
                <td className={scoreCellClassName}>
                    <ScoreCell value={scores.juryScore} />
                </td>
                <td className={cn(finalScoreCellClassName, 'font-bold')}>
                    <ScoreCell value={scores.finalScore} />
                </td>
            </tr>

            {isExpanded && (
                <tr className="border-t border-black/20 bg-white">
                    <td colSpan={10} className="p-4">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600">Beworben am {formatAppliedAt(application.appliedAt)}</div>

                                <div className="flex flex-wrap gap-2">
                                    {genres.map(({ id, name }) => (
                                        <Badge key={id} label={name} backgroundColor="#fcb8b8" />
                                    ))}
                                </div>

                                <ApplicationTextBlock title="Beschreibung">{application.description}</ApplicationTextBlock>
                                <ApplicationTextBlock title="Motivation">{application.motivation}</ApplicationTextBlock>
                                <ApplicationTextBlock title="Weitere Infos">{application.additionalInfo}</ApplicationTextBlock>
                                <ApplicationTextBlock title="Diversitätsnotizen">{application.diversityNotes}</ApplicationTextBlock>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <div>
                                        <div className="font-display text-lg">Material für die Kuration</div>
                                        {privateLinks.length === 0 ? (
                                            <div className="text-gray-500">keine Links</div>
                                        ) : (
                                            <div className="space-y-1">
                                                {privateLinks.map(({ id, link }) => (
                                                    <div key={id}>
                                                        <NextLink
                                                            href={link}
                                                            target="_blank"
                                                            className="break-all underline hover:text-red-600"
                                                        >
                                                            {link}
                                                        </NextLink>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="font-display text-lg">Öffentliche Links</div>
                                        {publicLinks.length === 0 ? (
                                            <div className="text-gray-500">keine Links</div>
                                        ) : (
                                            <div className="space-y-1">
                                                {publicLinks.map(({ id, link }) => (
                                                    <div key={id}>
                                                        <NextLink
                                                            href={link}
                                                            target="_blank"
                                                            className="break-all underline hover:text-red-600"
                                                        >
                                                            {link}
                                                        </NextLink>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 rounded-md border border-black bg-gray-50 p-3">
                                <div>
                                    <div className="font-display text-xl">Score-Aufschlüsselung</div>
                                    <div className="mt-2 space-y-1 text-sm">
                                        <div>Personen insgesamt: {application.participantCount}</div>
                                        <div>
                                            Davon FLINTA*: {application.flintaParticipantsCount} von {application.participantCount} ={' '}
                                            {formatCurationScore(scores.bonusParts.flinta)}
                                        </div>
                                        <div>
                                            Marginalisierte Personen: {application.hasMarginalizedParticipants ? 'ja' : 'nein'} ={' '}
                                            {formatCurationScore(scores.bonusParts.marginalized)}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                                            <span>Noch nicht teilgenommen:</span>
                                            <div className="inline-flex gap-1 rounded border border-black/10 bg-gray-200/60 p-0.5">
                                                <button
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={handlePastParticipationUnknown}
                                                    className={cn(
                                                        'cursor-pointer rounded px-2 py-0.5 text-[10px] font-bold transition-all disabled:cursor-not-allowed',
                                                        application.hasParticipatedBefore === null
                                                            ? 'bg-black text-white'
                                                            : 'text-gray-600 hover:bg-black/5',
                                                    )}
                                                >
                                                    unbekannt
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={handlePastParticipationNo}
                                                    className={cn(
                                                        'cursor-pointer rounded px-2 py-0.5 text-[10px] font-bold transition-all disabled:cursor-not-allowed',
                                                        application.hasParticipatedBefore === false
                                                            ? 'bg-black text-white'
                                                            : 'text-gray-600 hover:bg-black/5',
                                                    )}
                                                >
                                                    ja (+1)
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={handlePastParticipationYes}
                                                    className={cn(
                                                        'cursor-pointer rounded px-2 py-0.5 text-[10px] font-bold transition-all disabled:cursor-not-allowed',
                                                        application.hasParticipatedBefore === true
                                                            ? 'bg-black text-white'
                                                            : 'text-gray-600 hover:bg-black/5',
                                                    )}
                                                >
                                                    nein
                                                </button>
                                            </div>
                                            <span className="tabular-nums">= {formatCurationScore(scores.bonusParts.firstTime)}</span>
                                        </div>
                                        <div>
                                            Lokal: {localZipcodeCount} von {zipcodes.length} PLZ ={' '}
                                            {formatCurationScore(scores.bonusParts.local)}
                                        </div>
                                        {zipcodes.length > 0 && (
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {zipcodes.map((zipcode) => {
                                                    const local = isLocalZipcode(zipcode);

                                                    return (
                                                        <span
                                                            key={zipcode.id}
                                                            className={cn(
                                                                'rounded border bg-transparent px-2 py-1 text-xs',
                                                                local ? 'border-green-600 text-green-800' : 'border-gray-300 text-gray-500',
                                                            )}
                                                        >
                                                            {zipcode.isInternational ? 'Land' : 'PLZ'} {zipcode.code}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-600">
                                            Lokal zählen deutsche PLZ mit {localZipcodePrefixes.map((prefix) => `${prefix}xx`).join(', ')}{' '}
                                            als Münster/nahes Münsterland.
                                        </div>
                                    </div>
                                </div>

                                <ApplicationJuryVotesEditor
                                    applicationId={application.id}
                                    bonusScore={scores.bonusScore}
                                    juryVotes={application.juryVotes}
                                />

                                <button
                                    type="button"
                                    className="w-full rounded border border-black bg-white px-4 py-2 text-sm hover:bg-yellow-50"
                                    onClick={handleShowDetails}
                                >
                                    Volle Bewerbungsdetails öffnen
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </Fragment>
    );
};

const ApplicationCurationOverview = ({ applications, participantGenres, allLinks, allZipcodes, allGenres }: Props): ReactElement => {
    const [searchText, setSearchText] = useState('');
    const [filteredTypes, setFilteredTypes] = useState<Array<Type>>([]);
    const [curationStateFilter, setCurationStateFilter] = useState<CurationStateFilter>('all');
    const [sortOption, setSortOption] = useState<SortOption>('applied-asc');
    const [expandedApplicationId, setExpandedApplicationId] = useState<number | null>(null);
    const [detailsApplicationId, setDetailsApplicationId] = useState<number | null>(null);

    const rows = useMemo<Array<ApplicationRow>>(
        () =>
            applications.map((application) => {
                const zipcodes = allZipcodes.filter(({ participantId }) => participantId === application.id);
                const participantGenreIds = participantGenres
                    .filter(({ participantId }) => participantId === application.id)
                    .map(({ genreId }) => genreId);
                const genres = allGenres.filter(({ id }) => participantGenreIds.includes(id));

                return {
                    application,
                    genres,
                    links: allLinks.filter(({ participantId }) => participantId === application.id),
                    zipcodes,
                    scores: calculateCurationScores({ ...application, zipcodes }),
                };
            }),
        [allGenres, allLinks, allZipcodes, applications, participantGenres],
    );

    const filteredRows = useMemo<Array<ApplicationRow>>(() => {
        const normalizedSearchText = searchText.trim().toLocaleLowerCase('de-DE');
        const matchingRows = rows.filter((row) => {
            const { application } = row;
            const matchesText =
                normalizedSearchText.length === 0 || application.name.toLocaleLowerCase('de-DE').includes(normalizedSearchText);
            const matchesType = filteredTypes.length === 0 || filteredTypes.includes(application.type);
            const matchesCurationState =
                curationStateFilter === 'all' ||
                (curationStateFilter === 'curated' && isCurated(row)) ||
                (curationStateFilter === 'open' && !isCurated(row));

            return matchesText && matchesType && matchesCurationState;
        });

        const direction = getSortDirection(sortOption);

        if (scoreSortOptions.has(sortOption)) {
            const curatedRows = matchingRows.filter(isCurated);
            const openRows = matchingRows.filter((row) => !isCurated(row));

            return [
                ...orderBy(curatedRows, [(row) => getSortValue(row, sortOption)], [direction]),
                ...orderBy(openRows, [(row) => getSortValue(row, sortOption)], [direction]),
            ];
        }

        return orderBy(matchingRows, [(row) => getSortValue(row, sortOption)], [direction]);
    }, [curationStateFilter, filteredTypes, rows, searchText, sortOption]);

    const detailsRow = rows.find(({ application }) => application.id === detailsApplicationId);

    const toggleExpandedApplication = useCallback((id: number) => {
        setExpandedApplicationId((currentId) => (currentId === id ? null : id));
    }, []);
    const handleSearchTextChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value), []);
    const handleSortOptionChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => setSortOption(event.target.value as SortOption),
        [],
    );
    const handleCurationStateFilterChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => setCurationStateFilter(event.target.value as CurationStateFilter),
        [],
    );
    const handleFilteredTypeToggle = useCallback((type: Type) => setFilteredTypes((types) => xor(types, [type])), []);
    const handleDetailsShow = useCallback((id: number) => setDetailsApplicationId(id), []);
    const handleDetailsClose = useCallback(() => setDetailsApplicationId(null), []);

    const applicationAmount =
        filteredRows.length === applications.length ? applications.length.toString() : `${filteredRows.length} von ${applications.length}`;

    return (
        <div className="space-y-5">
            <div>
                <div className="text-center font-display text-4xl uppercase">Programmbeiträge Kuration ({applicationAmount})</div>
            </div>

            <div className="rounded-md border border-black bg-white/70 p-3 shadow-lg backdrop-blur-2xl">
                <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_260px_220px]">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-bold">Name suchen</span>
                        <input
                            value={searchText}
                            className="rounded border border-black bg-white p-2 outline-0"
                            placeholder="Bewerbungsname"
                            onChange={handleSearchTextChange}
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-bold">Sortierung</span>
                        <select
                            value={sortOption}
                            className="rounded border border-black bg-white p-2 outline-0"
                            onChange={handleSortOptionChange}
                        >
                            {sortOptions.map(({ label, value }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-bold">Kurationsstand</span>
                        <select
                            value={curationStateFilter}
                            className="rounded border border-black bg-white p-2 outline-0"
                            onChange={handleCurationStateFilterChange}
                        >
                            {curationStateOptions.map(({ label, value }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="mt-4 space-y-3">
                    <div>
                        <div className="mb-1 text-sm font-bold">Typen</div>
                        <div className="flex flex-wrap gap-2">
                            {allTypes.map((type) => (
                                <FilterToggleButton
                                    key={type}
                                    isActive={filteredTypes.includes(type)}
                                    label={typeLabels[type]}
                                    onToggle={handleFilteredTypeToggle}
                                    value={type}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-md border border-black bg-white/80 shadow-lg backdrop-blur-2xl">
                <table className="w-full min-w-[70rem] table-fixed border-collapse text-left text-sm">
                    <thead className="bg-black font-display text-xs text-white uppercase">
                        <tr>
                            <th className="py-2 pr-2 pl-4">Name</th>
                            <th className="w-24 p-2">Typ</th>
                            <th className="w-56 p-2">Status</th>
                            <th className={scoreCellClassName}>FLINTA*</th>
                            <th className={scoreCellClassName}>Marg.</th>
                            <th className={scoreCellClassName}>Erstmals</th>
                            <th className={scoreCellClassName}>Lokal</th>
                            <th className={scoreCellClassName}>Bonus</th>
                            <th className={scoreCellClassName}>Jury</th>
                            <th className={finalScoreCellClassName}>Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map((row) => (
                            <ApplicationCurationRow
                                key={row.application.id}
                                row={row}
                                isExpanded={expandedApplicationId === row.application.id}
                                onShowDetails={handleDetailsShow}
                                onToggleExpanded={toggleExpandedApplication}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {detailsRow !== undefined && <ApplicationDetailsOverlay row={detailsRow} onClose={handleDetailsClose} />}
        </div>
    );
};

export default ApplicationCurationOverview;
