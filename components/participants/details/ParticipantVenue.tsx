import type { Location } from '@prisma/client';
import formatDate from 'lib/common/helper/formatDate';
import isEmptyString from 'lib/common/helper/isEmptyString';
import Image from 'next/image';
import type { ReactElement } from 'react';

interface Props {
    location: Location;
    dates: Array<Date>;
    showAccessibleInfo: boolean;
}

const ParticipantVenue = ({ location: { name: location, awarenessInfo }, dates, showAccessibleInfo }: Props): ReactElement | null => {
    if (!showAccessibleInfo) {
        return <div>{[location, dates.map((date) => formatDate(date, 'EEE dd.MM.')).join(' & ')].join(' / ')}</div>;
    }

    return (
        <div>
            <div>{[location, dates.map((date) => formatDate(date, 'EEE dd.MM.')).join(' & ')].join(' / ')}</div>
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

export default ParticipantVenue;
