import { withSearchParams } from '@/lib/intern/internFilterSearchParams';
import { festivalDayViews } from '@/lib/schedule/festivalWindow';
import { parseAsString, parseAsStringLiteral } from 'nuqs';

const dayLabels = festivalDayViews.map(({ label }) => label) as [string, ...Array<string>];

const slotplanFromValue = 'slotplan';

export const slotplanFilterParsers = {
    day: parseAsStringLiteral(dayLabels).withDefault(festivalDayViews[0]!.label),
    area: parseAsString.withDefault('all'),
};

export const slotplanFilterUrlOptions = {
    history: 'replace' as const,
    shallow: true,
};

export type SlotplanAreaFilter = number | 'all' | 'unassigned';

export const parseSlotplanAreaFilter = (area: string): SlotplanAreaFilter => {
    if (area === 'all' || area === 'unassigned') {
        return area;
    }

    const areaId = Number(area);

    return Number.isInteger(areaId) && areaId > 0 ? areaId : 'all';
};

export const serializeSlotplanAreaFilter = (area: SlotplanAreaFilter): string =>
    area === 'all' || area === 'unassigned' ? area : area.toString();

const buildSlotplanHref = (day: string, area: SlotplanAreaFilter): string => {
    const params = new URLSearchParams();
    params.set('day', day);
    params.set('area', serializeSlotplanAreaFilter(area));

    return `/intern/slotplan?${params.toString()}`;
};

export const buildSlotplanDetailHref = (participantId: number, day: string, area: SlotplanAreaFilter): string => {
    const params = new URLSearchParams();
    params.set('from', slotplanFromValue);
    params.set('day', day);
    params.set('area', serializeSlotplanAreaFilter(area));

    return `/intern/${participantId}?${params.toString()}`;
};

export const buildContributionBackHref = (searchParams: {
    get: (name: string) => string | null;
    toString: () => string;
}): { href: string; label: string } => {
    if (searchParams.get('from') === slotplanFromValue) {
        const day = searchParams.get('day') ?? festivalDayViews[0]!.label;
        const area = parseSlotplanAreaFilter(searchParams.get('area') ?? 'all');

        return {
            href: buildSlotplanHref(day, area),
            label: '← Zurück zum Slotplan',
        };
    }

    return {
        href: withSearchParams('/intern', searchParams),
        label: '← Zurück zur Übersicht',
    };
};
