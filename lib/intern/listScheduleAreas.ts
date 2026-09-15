import type { ListParticipantScheduleAreas } from '@/typings/SerializableListParticipant';
import { compact, uniq } from 'lodash';

const toListScheduleAreas = (areaIds: Array<number | null>): ListParticipantScheduleAreas => ({
    hasUnassignedScheduleEntry: areaIds.includes(null),
    programLocationAreaIds: uniq(compact(areaIds)),
});

export default toListScheduleAreas;
