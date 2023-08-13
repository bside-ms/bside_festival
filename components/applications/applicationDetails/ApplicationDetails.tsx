import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Label, Link } from '@prisma/client';
import Image from 'next/image';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';
import ApplicationCurationForm from 'components/applications/applicationCuration/ApplicationCurationForm';
import ApplicationDescriptionForm from 'components/applications/applicationCuration/ApplicationDescriptionForm';
import ApplicationDetailsAdditionalInfo from 'components/applications/applicationDetails/ApplicationDetailsAdditionalInfo';
import ApplicationDetailsContacts from 'components/applications/applicationDetails/ApplicationDetailsContacts';
import ApplicationDetailsLinks from 'components/applications/applicationDetails/ApplicationDetailsLinks';
import ApplicationDetailsMotivation from 'components/applications/applicationDetails/ApplicationDetailsMotivation';
import ApplicationDetailsTechnicalRider from 'components/applications/applicationDetails/ApplicationDetailsTechnicalRider';
import ApplicationLabels from 'components/applications/common/ApplicationLabels';
import TypeBadge from 'components/participants/details/TypeBadge';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import statusLabels from 'lib/participants/status/statusLabels';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
    labels: Array<Label>;
    links: Array<Link>;
    onCloseClick: () => void;
}

const ApplicationDetails = ({ application, labels, links, onCloseClick }: Props): ReactElement => {

    const { name, imageFileName, type, curationScore, status } = application;

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
                    <div className="flex gap-2 mb-2">
                        <TypeBadge type={type} />

                        {isNotEmptyNumber(curationScore) && (
                            <div className="rounded-2xl text-sm px-3 py-1 bg-gray-800 text-white">
                                {curationScore}
                            </div>
                        )}

                        <div
                            className="uppercase inline-block select-none rounded-2xl text-sm px-3 py-1 bg-gray-800 text-white"
                        >
                            {statusLabels[status]}
                        </div>
                    </div>

                    <ApplicationLabels labels={labels} />

                    <div className="text-2xl font-display">
                        {name}
                    </div>

                    <ApplicationDescriptionForm
                        application={application}
                    />
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
                <ApplicationCurationForm application={application} labels={labels} />
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
