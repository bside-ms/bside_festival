import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Label, Link } from '@prisma/client';
import Image from 'next/image';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';
import ApplicationCurationForm from 'components/applications/applicationCuration/ApplicationCurationForm';
import ApplicationDescriptionForm from 'components/applications/applicationCuration/ApplicationDescriptionForm';
import ApplicationDetailsAdditionalInfo from 'components/applications/applicationDetails/ApplicationDetailsAdditionalInfo';
import ApplicationDetailsCanProvideBackline from 'components/applications/applicationDetails/ApplicationDetailsCanProvideBackline';
import ApplicationDetailsContacts from 'components/applications/applicationDetails/ApplicationDetailsContacts';
import ApplicationDetailsLinks from 'components/applications/applicationDetails/ApplicationDetailsLinks';
import ApplicationDetailsMaterialExpenses from 'components/applications/applicationDetails/ApplicationDetailsMaterialExpenses';
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
            <div className="relative flex flex-col justify-between gap-4 rounded-md p-3 text-gray-800 shadow-lg backdrop-blur-2xl md:flex-row-reverse md:p-5">
                <div className="relative h-[300px] shrink-0 overflow-auto rounded-md md:w-1/3">
                    {isNotEmptyString(imageUrl) && (
                        <NextLink href={imageUrl} className="md:cursor-pointer" target="_blank">
                            <Image src={imageUrl} alt={name} fill={true} priority={true} className="object-cover" />
                        </NextLink>
                    )}
                </div>

                <div className="shrink grow-0">
                    <div className="mb-2 flex gap-2">
                        <TypeBadge type={type} />

                        {isNotEmptyNumber(curationScore) && (
                            <div className="rounded-2xl bg-gray-800 px-3 py-1 text-sm text-white">{curationScore}</div>
                        )}

                        <div className="inline-block select-none rounded-2xl bg-gray-800 px-3 py-1 text-sm uppercase text-white">
                            {statusLabels[status]}
                        </div>
                    </div>

                    <ApplicationLabels labels={labels} />

                    <div className="font-display text-2xl">{name}</div>

                    <ApplicationDescriptionForm application={application} />
                </div>
            </div>

            <div className="relative mt-1 rounded-md px-3 py-2 text-gray-800 shadow-lg backdrop-blur-2xl md:px-5">
                <ApplicationDetailsMotivation application={application} />

                <ApplicationDetailsLinks links={links} />

                <ApplicationDetailsContacts application={application} />

                <ApplicationDetailsTechnicalRider application={application} />

                <ApplicationDetailsMaterialExpenses application={application} />

                <ApplicationDetailsCanProvideBackline application={application} />

                <ApplicationDetailsAdditionalInfo application={application} />
            </div>

            <div className="relative mt-1 rounded-md px-3 py-2 text-gray-800 shadow-lg backdrop-blur-2xl md:px-5">
                <ApplicationCurationForm application={application} labels={labels} />
            </div>

            <div
                className="relative mt-1 flex justify-center rounded-md p-1 text-gray-800 shadow-lg backdrop-blur-2xl hover:brightness-110 md:hover:cursor-pointer"
                onClick={onCloseClick}
            >
                <FontAwesomeIcon className="w-5" icon={faTimes} />
            </div>
        </div>
    );
};

export default ApplicationDetails;
