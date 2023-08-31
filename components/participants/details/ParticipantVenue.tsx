import type { Location } from '@prisma/client';
import Image from 'next/image';
import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';

interface Props {
    location: Location;
    showAccessibleInfo: boolean;
}

const ParticipantVenue = ({ location: { name: location, awarenessInfo }, showAccessibleInfo }: Props): ReactElement | null => {

    if (!showAccessibleInfo) {
        return <div>{location}</div>;
    }

    return (
        <div>
            <div>{location}</div>
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
                        <div>
                            Barrierefreier Zugang
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center">
                            <Image
                                src="/assets/stairs.png"
                                alt={awarenessInfo}
                                width={15}
                                height={15}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            {awarenessInfo}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ParticipantVenue;
