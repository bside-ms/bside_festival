import { homeDateDays, homeDateMonth } from '@/lib/public/homeContent';
import type { SharepicLang } from '@/lib/sharepic/sharepicFormats';
import { ScheduleEntryTimeMode } from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';
import { de, enUS } from 'date-fns/locale';

type SharepicScheduleEntry = {
    allDayDates: Array<string> | unknown;
    id: number;
    startsAt: Date | null;
    timeMode: ScheduleEntryTimeMode;
    programLocation: { name: string };
};

export type SharepicAppearance = {
    id: number;
    place: string;
    when: string;
};

const dateLocale = (lang: SharepicLang) => (lang === 'en' ? enUS : de);

const formatSharepicDate = (date: Date, lang: SharepicLang, schema: { de: string; en: string }): string =>
    formatInTimeZone(date, 'Europe/Berlin', lang === 'en' ? schema.en : schema.de, { locale: dateLocale(lang) });

const formatAllDayDate = (date: string, lang: SharepicLang): string =>
    formatSharepicDate(new Date(`${date}T12:00:00+02:00`), lang, { de: 'EEEE, dd. MMMM', en: 'EEEE, d MMMM' });

const formatTimedDate = (date: Date, lang: SharepicLang): string => {
    const formatted = formatSharepicDate(date, lang, { de: 'EEEE, dd. MMMM · HH:mm', en: 'EEEE, d MMMM · HH:mm' });

    return lang === 'en' ? formatted : `${formatted} Uhr`;
};

export const sharepicFestivalDate = (lang: SharepicLang): string =>
    lang === 'en' ? '18–19 September' : `${homeDateDays} ${homeDateMonth}`;

const formatSharepicAppearances = (entries: Array<SharepicScheduleEntry>, lang: SharepicLang): Array<SharepicAppearance> =>
    entries.flatMap((entry) => {
        const dates =
            entry.timeMode === ScheduleEntryTimeMode.Timed && entry.startsAt !== null
                ? [formatTimedDate(entry.startsAt, lang)]
                : Array.isArray(entry.allDayDates)
                  ? entry.allDayDates.filter((date): date is string => typeof date === 'string').map((date) => formatAllDayDate(date, lang))
                  : [];

        return [{ id: entry.id, place: entry.programLocation.name, when: dates.join(' · ') }];
    });

export default formatSharepicAppearances;
