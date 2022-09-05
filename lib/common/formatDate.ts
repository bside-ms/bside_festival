import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const formatDate = (date: Date | string, formatSchema: string): string => (
    format(typeof date === 'string' ? new Date(date) : date, formatSchema, { locale: de })
);

export default formatDate;
