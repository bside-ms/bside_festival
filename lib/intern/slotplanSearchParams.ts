import { withSearchParams } from '@/lib/intern/internFilterSearchParams';
import { festivalDayViews } from '@/lib/schedule/festivalWindow';
import { parseAsBoolean, parseAsString, parseAsStringLiteral } from 'nuqs';

const dayLabels = festivalDayViews.map(({ label }) => label) as [string, ...Array<string>];

const slotplanFromValue = 'slotplan';
const slotplanTabValues = ['planner', 'locations'] as const;

export const slotplanFilterParsers = {
    confirmedOnly: parseAsBoolean.withDefault(false),
    day: parseAsStringLiteral(dayLabels).withDefault(festivalDayViews[0]!.label),
    area: parseAsString.withDefault('all'),
    hideNotes: parseAsBoolean.withDefault(false),
    showEmpty: parseAsBoolean.withDefault(false),
    tab: parseAsStringLiteral(slotplanTabValues).withDefault('planner'),
};

export const slotplanFilterUrlOptions = {
    history: 'replace' as const,
    shallow: true,
};

export type SlotplanAreaFilter = number | 'all' | 'unassigned';

export type SlotplanViewFilters = {
    area: SlotplanAreaFilter;
    confirmedOnly?: boolean;
    day: string;
    hideNotes?: boolean;
    showEmpty?: boolean;
};

export const parseSlotplanAreaFilter = (area: string): SlotplanAreaFilter => {
    if (area === 'all' || area === 'unassigned') {
        return area;
    }

    const areaId = Number(area);

    return Number.isInteger(areaId) && areaId > 0 ? areaId : 'all';
};

export const serializeSlotplanAreaFilter = (area: SlotplanAreaFilter): string =>
    area === 'all' || area === 'unassigned' ? area : area.toString();

const appendSlotplanViewParams = (params: URLSearchParams, filters: SlotplanViewFilters): void => {
    params.set('day', filters.day);
    params.set('area', serializeSlotplanAreaFilter(filters.area));

    if (filters.showEmpty) {
        params.set('showEmpty', 'true');
    }

    if (filters.confirmedOnly) {
        params.set('confirmedOnly', 'true');
    }

    if (filters.hideNotes) {
        params.set('hideNotes', 'true');
    }
};

const buildSlotplanHref = (filters: SlotplanViewFilters): string => {
    const params = new URLSearchParams();
    appendSlotplanViewParams(params, filters);

    return `/intern/slotplan?${params.toString()}`;
};

export const buildSlotplanDetailHref = (participantId: number, filters: SlotplanViewFilters): string => {
    const params = new URLSearchParams();
    params.set('from', slotplanFromValue);
    appendSlotplanViewParams(params, filters);

    return `/intern/${participantId}?${params.toString()}`;
};

export const buildContributionBackHref = (searchParams: {
    get: (name: string) => string | null;
    toString: () => string;
}): { href: string; label: string } => {
    if (searchParams.get('from') === slotplanFromValue) {
        return {
            href: buildSlotplanHref({
                area: parseSlotplanAreaFilter(searchParams.get('area') ?? 'all'),
                confirmedOnly: searchParams.get('confirmedOnly') === 'true',
                day: searchParams.get('day') ?? festivalDayViews[0]!.label,
                hideNotes: searchParams.get('hideNotes') === 'true',
                showEmpty: searchParams.get('showEmpty') === 'true',
            }),
            label: '← Zurück zum Slotplan',
        };
    }

    return {
        href: withSearchParams('/intern', searchParams),
        label: '← Zurück zur Übersicht',
    };
};
