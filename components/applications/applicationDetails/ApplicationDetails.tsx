import ApplicationCurationForm from '@/components/applications/applicationCuration/ApplicationCurationForm';
import ApplicationNameAndDescriptionForm from '@/components/applications/applicationCuration/ApplicationNameAndDescriptionForm';
import ApplicationDetailsAdditionalInfo from '@/components/applications/applicationDetails/ApplicationDetailsAdditionalInfo';
import ApplicationDetailsAllergies from '@/components/applications/applicationDetails/ApplicationDetailsAllergies';
import ApplicationDetailsCanProvideBackline from '@/components/applications/applicationDetails/ApplicationDetailsCanProvideBackline';
import ApplicationDetailsContacts from '@/components/applications/applicationDetails/ApplicationDetailsContacts';
import ApplicationDetailsDiversity from '@/components/applications/applicationDetails/ApplicationDetailsDiversity';
import ApplicationDetailsImage from '@/components/applications/applicationDetails/ApplicationDetailsImage';
import ApplicationDetailsLinks from '@/components/applications/applicationDetails/ApplicationDetailsLinks';
import ApplicationDetailsMotivation from '@/components/applications/applicationDetails/ApplicationDetailsMotivation';
import ApplicationDetailsParticipantCount from '@/components/applications/applicationDetails/ApplicationDetailsParticipantCount';
import ApplicationDetailsTechnicalRider from '@/components/applications/applicationDetails/ApplicationDetailsTechnicalRider';
import Badge from '@/components/participants/details/Badge';
import isNotEmptyNumber from '@/lib/common/helper/isNotEmptyNumber';
import statusLabels from '@/lib/participants/status/statusLabels';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Genre, Link } from '@prisma/client';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
    genres: Array<Genre>;
    links: Array<Link>;
    onCloseClick: () => void;
}

const ApplicationDetails = ({ application, genres, links, onCloseClick }: Props): ReactElement => {
    const { type, curationScore, status } = application;

    return (
        <div className="rounded-md border border-black">
            <div className="relative flex flex-col justify-between gap-2 md:flex-row-reverse">
                <ApplicationDetailsImage application={application} />

                <div className="shrink grow-0 p-2">
                    <div className="mb-2 flex flex-wrap gap-2">
                        <Badge label={typeLabels[type]} backgroundColor={typeColors[type]} />

                        {genres.map(({ id, name: genreName }) => (
                            <Badge key={id} label={genreName} backgroundColor="#fcb8b8" />
                        ))}

                        {isNotEmptyNumber(curationScore) && <Badge label={curationScore.toString()} backgroundColor="lightgray" />}

                        <Badge label={statusLabels[status]} backgroundColor="lightgray" />
                    </div>

                    <ApplicationNameAndDescriptionForm application={application} />
                </div>
            </div>

            <div className="relative mt-1 space-y-6 p-2">
                <ApplicationDetailsMotivation application={application} />

                <ApplicationDetailsParticipantCount application={application} />

                <ApplicationDetailsDiversity application={application} />

                <ApplicationDetailsAdditionalInfo application={application} />

                <ApplicationDetailsLinks links={links} />

                <ApplicationDetailsContacts application={application} />

                <ApplicationDetailsTechnicalRider application={application} />

                <ApplicationDetailsCanProvideBackline application={application} />

                <ApplicationDetailsAllergies application={application} />
            </div>

            <div className="relative mt-1 p-2">
                <ApplicationCurationForm application={application} />
            </div>

            <div
                className="relative mt-1 flex justify-center border-t border-black p-1 hover:brightness-110 md:hover:cursor-pointer"
                onClick={onCloseClick}
            >
                <FontAwesomeIcon className="w-5" icon={faTimes} />
            </div>
        </div>
    );
};

export default ApplicationDetails;
