import type { Link } from '@prisma/client';
import type { ReactElement } from 'react';
import ApplicationDetailsContacts from 'components/applications/applicationDetails/ApplicationDetailsContacts';
import ApplicationDetailsImage from 'components/applications/applicationDetails/ApplicationDetailsImage';
import ApplicationDetailsLinks from 'components/applications/applicationDetails/ApplicationDetailsLinks';
import ApplicationDetailsMotivation from 'components/applications/applicationDetails/ApplicationDetailsMotivation';
import ApplicationDetailsTechnicalRider from 'components/applications/applicationDetails/ApplicationDetailsTechnicalRider';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import typeLabels from 'lib/participants/typeLabels';
import type { SerializableParticipant } from 'pages/bewerbungen/[idAndName]';

interface Props {
    application: SerializableParticipant;
    links: Array<Link>;
}

const ApplicationDetails = ({ application, links }: Props): ReactElement => {

    const { name, type, description } = application;

    return (
        <div className="p-3 rounded-md shadow-lg relative text-gray-800">
            <ApplicationDetailsImage
                application={application}
            />

            <div className="uppercase text-sm text-gray-600">{typeLabels[type]}</div>

            <div className="text-xl">{name}</div>

            {isNotEmptyString(description) && <div>{description}</div>}

            <ApplicationDetailsMotivation application={application} />

            <ApplicationDetailsLinks links={links} />

            <ApplicationDetailsContacts application={application} />

            <ApplicationDetailsTechnicalRider application={application} />
        </div>
    );
};

export default ApplicationDetails;
