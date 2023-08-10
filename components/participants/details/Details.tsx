import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Link } from '@prisma/client';
import Image from 'next/image';
import { default as NextLink } from 'next/link';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import AdditionalInfo from 'components/participants/details/AdditionalInfo';
import Badges from 'components/participants/details/Badges';
import Contacts from 'components/participants/details/Contacts';
import DescriptionForm from 'components/participants/details/DescriptionForm';
import Links from 'components/participants/details/Links';
import TechnicalRider from 'components/participants/details/TechnicalRider';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
    links: Array<Link>;
    onCloseClick: () => void;
}

const Details = ({ application, links, onCloseClick }: Props): ReactElement => {

    const { status } = useSession();

    const { name, imageFileName } = application;

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
                    <Badges application={application} />

                    <div className="text-2xl font-display">
                        {name}
                    </div>

                    <DescriptionForm
                        application={application}
                    />
                </div>
            </div>

            {status === 'authenticated' && (
                <div
                    className="mt-1 px-3 md:px-5 py-2 rounded-md shadow-lg relative text-gray-800 backdrop-blur-2xl"
                >
                    <Links links={links} />

                    <Contacts application={application} />

                    <TechnicalRider application={application} />

                    <AdditionalInfo application={application} />
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
