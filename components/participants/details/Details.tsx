import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Link } from '@prisma/client';
import Image from 'next/image';
import { default as NextLink } from 'next/link';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import AdditionalInfo from 'components/participants/details/AdditionalInfo';
import Contacts from 'components/participants/details/Contacts';
import DescriptionForm from 'components/participants/details/DescriptionForm';
import Links from 'components/participants/details/Links';
import ParticipantSlots from 'components/participants/details/ParticipantSlots';
import TechnicalRider from 'components/participants/details/TechnicalRider';
import TypeBadge from 'components/participants/details/TypeBadge';
import SlotsForm from 'components/participants/slotsForm/SlotsForm';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    participant: SerializableParticipant;
    links: Array<Link>;
    onCloseClick: () => void;
}

const Details = ({ participant, links, onCloseClick }: Props): ReactElement => {

    const { status } = useSession();

    const { id, name, imageFileName, type } = participant;

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    return (
        <div>
            <div
                className="p-3 md:p-5 rounded-md shadow-lg relative text-gray-800 backdrop-blur-2xl flex flex-col md:flex-row-reverse justify-between gap-4"
            >
                <div className="md:w-1/3 shrink-0 relative rounded-md overflow-auto h-[300px]">
                    {isNotEmptyString(imageUrl) && (
                        <NextLink
                            href={imageUrl}
                            className="md:cursor-pointer"
                            target="_blank"
                        >
                            <Image
                                src={imageUrl}
                                alt={name}
                                fill={true}
                                priority={true}
                                className="object-cover"
                            />
                        </NextLink>
                    )}
                </div>

                <div className="shrink grow-0">
                    <div className="mb-1">
                        <TypeBadge type={type} />
                    </div>

                    <div className="text-2xl font-display">
                        {name}
                    </div>

                    <ParticipantSlots
                        participantId={id}
                    />

                    <DescriptionForm
                        participant={participant}
                    />
                </div>
            </div>

            {status === 'authenticated' && (
                <div
                    className="mt-1 px-3 md:px-5 py-2 rounded-md shadow-lg relative text-gray-800 backdrop-blur-2xl"
                >
                    <SlotsForm />
                </div>
            )}

            {status === 'authenticated' && (
                <div
                    className="mt-1 px-3 md:px-5 py-2 rounded-md shadow-lg relative text-gray-800 backdrop-blur-2xl"
                >
                    <Links links={links} />

                    <Contacts participant={participant} />

                    <TechnicalRider participant={participant} />

                    <AdditionalInfo participant={participant} />
                </div>
            )}

            <div
                className="mt-1 p-1 rounded-md shadow-lg relative text-gray-800 backdrop-blur-2xl flex justify-center md:hover:cursor-pointer hover:brightness-110"
                onClick={onCloseClick}
            >
                <FontAwesomeIcon className="w-5" icon={faTimes} />
            </div>
        </div>
    );
};

export default Details;
