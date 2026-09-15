import type { SerializableListParticipant } from '@/typings/SerializableListParticipant';
import { intersection } from 'lodash';

const matchesInternAreaFilter = (application: SerializableListParticipant, areaIds: Array<number>, includeUnassigned: boolean): boolean => {
    if (areaIds.length === 0 && !includeUnassigned) {
        return true;
    }

    return (
        intersection(areaIds, application.programLocationAreaIds).length > 0 ||
        (includeUnassigned && application.hasUnassignedScheduleEntry)
    );
};

export default matchesInternAreaFilter;
