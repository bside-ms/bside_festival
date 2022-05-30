import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/applications/ApplicationsOverview';
import ApplicationsOverviewNotAllowed from 'components/applications/ApplicationsOverviewNotAllowed';
import useIsGroupMember from 'lib/next-auth/useIsGroupMember';

const ApplicationsOverviewWrapper = (): ReactElement => {

    const { data: session, status } = useSession();
    const isInFestivalGroup = useIsGroupMember('/kreise/festival/mitglieder', session);

    if (status !== 'authenticated') {
        return <ApplicationsOverviewNotAllowed reason={status} />;
    }

    if (!isInFestivalGroup) {
        return <ApplicationsOverviewNotAllowed reason="notInFestival" />;
    }

    return <ApplicationsOverview />;
};

export default ApplicationsOverviewWrapper;
