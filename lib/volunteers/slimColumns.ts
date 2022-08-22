import type { IdType } from 'react-table';
import type VolunteerTableData from 'lib/volunteers/VolunteerTableData';

const slimColumns = new Array<IdType<VolunteerTableData>>(
    'isMusclesChecked',
    'isCarChecked',
    'isSocialChecked',
    'isTechnicianChecked',
    'isCookChecked',
    'isArtistChecked',
    'isMultiChecked',
    'isKidsChecked',
    'isCleanupChecked',
    'isFridayChecked',
    'isSaturdayChecked',
    'isSundayChecked',
);

export default slimColumns;
