import availableTypes from '@/lib/applications/availableTypes';
import statusOrder from '@/lib/participants/status/statusOrder';
import type { ApplicationStatus, Type } from '@prisma/client';
import { debounce, parseAsArrayOf, parseAsBoolean, parseAsString, parseAsStringLiteral } from 'nuqs';

const typeValues = availableTypes as Array<Type>;
const statusValues = statusOrder as Array<ApplicationStatus>;

export const internFilterParsers = {
    mine: parseAsBoolean.withDefault(false),
    q: parseAsString.withDefault('').withOptions({ limitUrlUpdates: debounce(300) }),
    statuses: parseAsArrayOf(parseAsStringLiteral(statusValues)).withDefault([]),
    types: parseAsArrayOf(parseAsStringLiteral(typeValues)).withDefault([]),
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
