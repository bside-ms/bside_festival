import { formatInTimeZone } from 'date-fns-tz';
import { de } from 'date-fns/locale';

const formatDate = (date: Date | string | number, formatSchema: string): string =>
    formatInTimeZone(typeof date === 'string' || typeof date === 'number' ? new Date(date) : date, 'Europe/Berlin', formatSchema, {
        locale: de,
    });

export default formatDate;
