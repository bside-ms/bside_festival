import availableTypes from '@/lib/applications/availableTypes';
import statusOrder from '@/lib/participants/status/statusOrder';
import type { ApplicationStatus, Type } from '@prisma/client';
import { debounce, parseAsArrayOf, parseAsBoolean, parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs';

const typeValues = availableTypes as Array<Type>;
const statusValues = statusOrder as Array<ApplicationStatus>;

const internListSortColumns = ['name', 'status', 'location', 'time', 'fee'] as const;
export type InternListSortColumn = (typeof internListSortColumns)[number];
const internListSortDirections = ['asc', 'desc'] as const;
export type InternListSortDirection = (typeof internListSortDirections)[number];

export const internFilterParsers = {
    areas: parseAsArrayOf(parseAsInteger).withDefault([]),
    datenExport: parseAsBoolean.withDefault(false),
    mailMerge: parseAsBoolean.withDefault(false),
    mine: parseAsBoolean.withDefault(false),
    q: parseAsString.withDefault('').withOptions({ limitUrlUpdates: debounce(300) }),
    sort: parseAsStringLiteral(internListSortColumns).withDefault('time'),
    sortDir: parseAsStringLiteral(internListSortDirections).withDefault('asc'),
    statuses: parseAsArrayOf(parseAsStringLiteral(statusValues)).withDefault([]),
    types: parseAsArrayOf(parseAsStringLiteral(typeValues)).withDefault([]),
    unassigned: parseAsBoolean.withDefault(false),
    unscheduled: parseAsBoolean.withDefault(false),
};

export const internFilterUrlOptions = {
    history: 'replace' as const,
    shallow: true,
};

export const withSearchParams = (pathname: string, searchParams: { toString: () => string }): string => {
    const query = searchParams.toString();

    return query.length > 0 ? `${pathname}?${query}` : pathname;
};
