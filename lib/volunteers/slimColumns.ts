import type { StringKey } from 'react-table';
import type VolunteerTableData from 'lib/volunteers/VolunteerTableData';

const slimColumns = new Array<StringKey<VolunteerTableData>>(
    'muscles',
    'car',
    'social',
    'technician',
    'cook',
    'artist',
    'multi',
    'kids',
    'cleanup',
    'isFridayChecked',
    'isSaturdayChecked',
    'isSundayChecked',
);

export default slimColumns;
