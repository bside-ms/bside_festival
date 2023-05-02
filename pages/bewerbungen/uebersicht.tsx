import * as process from 'process';
import type { Participant } from '@prisma/client';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/applications/applicationsOverview/ApplicationsOverview';
import fetcher from 'lib/common/fetcher';
import getUserSession from 'lib/next-auth/getUserSession';
import type { GetAllApplicationsResponse } from 'pages/api/applications/all';

interface Props {
    applications: Array<Participant>;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context): Promise<GetServerSidePropsResult<Props>> => {

    const userSession = await getUserSession(context);

    if (userSession === null) {
        return {
            redirect: {
                statusCode: 302,
                destination: '/',
            },
        };
    }

    const url = new URL(process.env.APP_URL);
    url.pathname = '/api/applications/all';

    const { applications } = await fetcher(url.toString()) as GetAllApplicationsResponse;

    return {
        props: { applications },
    };
};

export default ({ applications }: Props): ReactElement => {

    return (
        <div className="p-7">
            <ApplicationsOverview
                applications={applications}
            />
        </div>
    );
};
