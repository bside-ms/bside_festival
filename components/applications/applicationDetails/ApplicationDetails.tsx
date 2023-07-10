import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Link } from '@prisma/client';
import Image from 'next/image';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';
import ApplicationCuration from 'components/applications/applicationCuration/ApplicationCuration';
import ApplicationDetailsAdditionalInfo from 'components/applications/applicationDetails/ApplicationDetailsAdditionalInfo';
import ApplicationDetailsContacts from 'components/applications/applicationDetails/ApplicationDetailsContacts';
import ApplicationDetailsLinks from 'components/applications/applicationDetails/ApplicationDetailsLinks';
import ApplicationDetailsMotivation from 'components/applications/applicationDetails/ApplicationDetailsMotivation';
import ApplicationDetailsTechnicalRider from 'components/applications/applicationDetails/ApplicationDetailsTechnicalRider';
import ApplicationBadges from 'components/applications/common/ApplicationBadges';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
    links: Array<Link>;
    onCloseClick: () => void;
}

const ApplicationDetails = ({ application, links, onCloseClick }: Props): ReactElement => {

    const { name, type, description, imageFileName, curationScore } = application;

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
                    <ApplicationBadges application={application} />

                    <div className="text-2xl font-display">
                        {name}
                    </div>

                    {isNotEmptyString(description) && (
                        <div className="mt-4">
                            {description}
                        </div>
                    )}
                </div>
            </div>

            <div
                className="mt-1 px-3 md:px-5 py-2 rounded-md shadow-lg relative text-gray-800 backdrop-blur-2xl"
            >
                <ApplicationDetailsMotivation application={application} />

                <ApplicationDetailsLinks links={links} />

                <ApplicationDetailsContacts application={application} />

                <ApplicationDetailsTechnicalRider application={application} />

                <ApplicationDetailsAdditionalInfo application={application} />
            </div>

            <div
                className="mt-1 px-3 md:px-5 py-2 rounded-md shadow-lg relative text-gray-800 backdrop-blur-2xl"
            >
                <ApplicationCuration application={application} />
            </div>

            <div
                className="mt-1 p-1 rounded-md shadow-lg relative text-gray-800 backdrop-blur-2xl flex justify-center md:hover:cursor-pointer hover:brightness-110"
                onClick={onCloseClick}
            >
                <FontAwesomeIcon className="w-5" icon={faTimes} />
            </div>
        </div>
    );
};

export default ApplicationDetails;
