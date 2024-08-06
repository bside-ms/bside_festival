import type { Location } from '@prisma/client';
import Image from 'next/image';
import type { ReactElement } from 'react';
import formatDate from 'lib/common/helper/formatDate';
import isEmptyString from 'lib/common/helper/isEmptyString';
import type { SerializableSlot } from 'typings/SerializableSlot';
import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';

interface Props {
    slot: SerializableSlot;
    location: Location;
    showAccessibleInfo: boolean;
}

const ParticipantSlot = ({
    slot: { begin, maxAttendees },
    location: { name, awarenessInfo },
    showAccessibleInfo,
}: Props): ReactElement | null => {
    let dateAndLocation = `${formatDate(new Date(begin), 'EEE dd.MM. / HH:mm')} / ${name}`;

    if (isNotEmptyNumber(maxAttendees)) {
        dateAndLocation += ' / Anmeldung erforderlich';
    }

    if (!showAccessibleInfo) {
        return <div>{dateAndLocation}</div>;
    }

    return (
        <div>
            <div>{dateAndLocation}</div>
            <div className="flex items-center gap-2">
                {isEmptyString(awarenessInfo) ? (
                    <>
                        <div className="flex items-center">
                            <Image
                                src="/assets/wheelchair.png"
                                alt="Barrierefreier Zugang"
                                width={15}
                                height={15}
                                className="object-contain"
                            />
                        </div>
                        <div>Barrierefreier Zugang</div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center">
                            <Image src="/assets/stairs.png" alt={awarenessInfo} width={15} height={15} className="object-contain" />
                        </div>
                        <div>{awarenessInfo}</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ParticipantSlot;
