import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Genre, Label, Link } from '@prisma/client';
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
import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';
import statusLabels from 'lib/participants/status/statusLabels';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import ApplicationDetailsImage from 'components/applications/applicationDetails/ApplicationDetailsImage';
import ApplicationDetailsDiversity from 'components/applications/applicationDetails/ApplicationDetailsDiversity';
import ApplicationDetailsAllergies from 'components/applications/applicationDetails/ApplicationDetailsAllergies';
import ApplicationDetailsParticipantCount from 'components/applications/applicationDetails/ApplicationDetailsParticipantCount';

interface Props {
    application: SerializableParticipant;
    labels: Array<Label>;
    genres: Array<Genre>;
    links: Array<Link>;
    onCloseClick: () => void;
}

const ApplicationDetails = ({ application, labels, genres, links, onCloseClick }: Props): ReactElement => {
    const { name, type, curationScore, status } = application;

    return (
        <div>
            <div className="relative flex flex-col justify-between gap-4 rounded-md p-3 shadow-lg backdrop-blur-2xl md:flex-row-reverse md:p-5 bg-white/20">
                <ApplicationDetailsImage application={application} />

                <div className="shrink grow-0">
                    <div className="mb-2 flex gap-2 flex-wrap">
                        <TypeBadge type={type} />

                        {genres.map(({ id, name: genreName }) => (
                            <div
                                key={id}
                                className="rounded-2xl bg-gray-200/60 px-3 py-1 text-sm text-gray-700 uppercase whitespace-nowrap max-w-50 overflow-hidden text-ellipsis"
                                title={genreName}
                            >
                                {genreName}
                            </div>
                        ))}

                        {isNotEmptyNumber(curationScore) && (
                            <div className="rounded-2xl bg-gray-800 px-3 py-1 text-sm text-white">{curationScore}</div>
                        )}

                        <div className="inline-block select-none rounded-2xl bg-gray-800 px-3 py-1 text-sm uppercase text-white">
                            {statusLabels[status]}
                        </div>
                    </div>

                    <ApplicationLabels labels={labels} />

                    <div className="font-display text-2xl text-gray-100">{name}</div>

                    <ApplicationDescriptionForm application={application} />
                </div>
            </div>

            <div className="relative mt-1 rounded-md px-3 py-4 text-gray-100 shadow-lg backdrop-blur-2xl md:px-5 space-y-6 bg-white/20">
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

            <div className="relative mt-1 rounded-md px-3 py-2 shadow-lg backdrop-blur-2xl md:px-5 bg-white/20">
                <ApplicationCurationForm application={application} labels={labels} />
            </div>

            <div
                className="relative mt-1 flex justify-center rounded-md p-1 text-gray-100 shadow-lg bg-white/20 backdrop-blur-2xl hover:brightness-110 md:hover:cursor-pointer"
                onClick={onCloseClick}
            >
                <FontAwesomeIcon className="w-5" icon={faTimes} />
            </div>
        </div>
    );
};

export default ApplicationDetails;
