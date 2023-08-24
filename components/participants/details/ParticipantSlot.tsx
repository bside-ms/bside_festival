import type { Location } from '@prisma/client';
import type { ReactElement } from 'react';
import AccessibleIcon from 'components/participants/details/AccessibleIcon';
import formatDate from 'lib/common/helper/formatDate';
import isEmptyString from 'lib/common/helper/isEmptyString';
import type { SerializableSlot } from 'typings/SerializableSlot';

interface Props {
    slot: SerializableSlot;
    location: Location;
    showAccessibleInfo: boolean;
}

const ParticipantSlot = ({ slot, location: { name, awarenessInfo }, showAccessibleInfo }: Props): ReactElement | null => {

    const dateAndLocation = `${formatDate(new Date(slot.begin), 'EEE dd.MM. / HH:mm')} / ${name}`;

    if (isEmptyString(awarenessInfo)) {
        return <div>{dateAndLocation}</div>;
    }

    if (showAccessibleInfo) {
        return (
            <div>
                <div>{dateAndLocation}</div>
                <div className="flex items-center gap-1">
                    <div className="flex items-center"><AccessibleIcon /></div>
                    <div>{awarenessInfo}</div>
                </div>
            </div>
        );

    }

    return (
        <div className="flex items-center gap-1">
            <div>{dateAndLocation}</div>
            <AccessibleIcon />
        </div>
    );
};

export default ParticipantSlot;
