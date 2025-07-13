import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Genre, Link } from '@prisma/client';
import ApplicationCurationForm from 'components/applications/applicationCuration/ApplicationCurationForm';
import ApplicationNameAndDescriptionForm from 'components/applications/applicationCuration/ApplicationNameAndDescriptionForm';
import ApplicationDetailsAdditionalInfo from 'components/applications/applicationDetails/ApplicationDetailsAdditionalInfo';
import ApplicationDetailsAllergies from 'components/applications/applicationDetails/ApplicationDetailsAllergies';
import ApplicationDetailsCanProvideBackline from 'components/applications/applicationDetails/ApplicationDetailsCanProvideBackline';
import ApplicationDetailsContacts from 'components/applications/applicationDetails/ApplicationDetailsContacts';
import ApplicationDetailsDiversity from 'components/applications/applicationDetails/ApplicationDetailsDiversity';
import ApplicationDetailsImage from 'components/applications/applicationDetails/ApplicationDetailsImage';
import ApplicationDetailsLinks from 'components/applications/applicationDetails/ApplicationDetailsLinks';
import ApplicationDetailsMaterialExpenses from 'components/applications/applicationDetails/ApplicationDetailsMaterialExpenses';
import ApplicationDetailsMotivation from 'components/applications/applicationDetails/ApplicationDetailsMotivation';
import ApplicationDetailsParticipantCount from 'components/applications/applicationDetails/ApplicationDetailsParticipantCount';
import ApplicationDetailsTechnicalRider from 'components/applications/applicationDetails/ApplicationDetailsTechnicalRider';
import Badge from 'components/participants/details/Badge';
import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';
import statusLabels from 'lib/participants/status/statusLabels';
import typeColors from 'lib/participants/typeColors';
import typeLabels from 'lib/participants/typeLabels';
import type { ReactElement } from 'react';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
    genres: Array<Genre>;
    links: Array<Link>;
    onCloseClick: () => void;
}

const ApplicationDetails = ({ application, genres, links, onCloseClick }: Props): ReactElement => {
    const { type, curationScore, status } = application;

    return (
        <div>
            <div className="relative flex flex-col justify-between gap-4 rounded-md bg-white/20 p-3 shadow-lg backdrop-blur-2xl md:flex-row-reverse md:p-5">
                <ApplicationDetailsImage application={application} />

                <div className="shrink grow-0">
                    <div className="mb-2 flex flex-wrap gap-2">
                        <Badge label={typeLabels[type]} backgroundColor={typeColors[type]} />

                        {genres.map(({ id, name: genreName }) => (
                            <div
                                key={id}
                                className="max-w-50 overflow-hidden rounded-2xl bg-gray-200/60 px-3 py-1 text-sm text-ellipsis whitespace-nowrap text-gray-700 uppercase"
                                title={genreName}
                            >
                                {genreName}
                            </div>
                        ))}

                        {isNotEmptyNumber(curationScore) && (
                            <div className="rounded-2xl bg-gray-800 px-3 py-1 text-sm text-white">{curationScore}</div>
                        )}

                        <div className="inline-block rounded-2xl bg-gray-800 px-3 py-1 text-sm text-white uppercase select-none">
                            {statusLabels[status]}
                        </div>
                    </div>

                    <ApplicationNameAndDescriptionForm application={application} />
                </div>
            </div>

            <div className="relative mt-1 space-y-6 rounded-md bg-white/20 px-3 py-4 text-gray-100 shadow-lg backdrop-blur-2xl md:px-5">
                <ApplicationDetailsMotivation application={application} />

                <ApplicationDetailsParticipantCount application={application} />

                <ApplicationDetailsDiversity application={application} />

                <ApplicationDetailsAdditionalInfo application={application} />

                <ApplicationDetailsLinks links={links} />

                <ApplicationDetailsContacts application={application} />

                <ApplicationDetailsTechnicalRider application={application} />

                <ApplicationDetailsMaterialExpenses application={application} />

                <ApplicationDetailsCanProvideBackline application={application} />

                <ApplicationDetailsAllergies application={application} />
            </div>

            <div className="relative mt-1 rounded-md bg-white/20 px-3 py-2 shadow-lg backdrop-blur-2xl md:px-5">
                <ApplicationCurationForm application={application} />
            </div>

            <div
                className="relative mt-1 flex justify-center rounded-md bg-white/20 p-1 text-gray-100 shadow-lg backdrop-blur-2xl hover:brightness-110 md:hover:cursor-pointer"
                onClick={onCloseClick}
            >
                <FontAwesomeIcon className="w-5" icon={faTimes} />
            </div>
        </div>
    );
};

export default ApplicationDetails;
