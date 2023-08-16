import type { Location } from '@prisma/client';
import type { ReactElement } from 'react';
import formatDate from 'lib/common/helper/formatDate';
import type { SerializableSlot } from 'typings/SerializableSlot';

interface Props {
    slot: SerializableSlot;
    location: Location;
}

const ParticipantSlot = ({ slot, location }: Props): ReactElement | null => {

    return (
        <div>
            {formatDate(new Date(slot.begin), 'dd.MM. / HH:mm')} / {location.name}
        </div>
    );
};

export default ParticipantSlot;
