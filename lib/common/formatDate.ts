import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const formatDate = (date: Date, formatSchema: string): string => format(date, formatSchema, { locale: de });

export default formatDate;
