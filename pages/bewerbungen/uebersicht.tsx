import * as process from 'process';
import type { Participant } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/participants/applicationsOverview/ApplicationsOverview';
import fetcher from 'lib/common/fetcher';
import getUserSession from 'lib/next-auth/getUserSession';
import type { GetAllParticipantsResponse } from 'pages/api/participants/all';

interface Props {
    participants: Array<Participant>;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {

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
    url.pathname = '/api/participants/all';

    const { participants } = await fetcher(url.toString()) as GetAllParticipantsResponse;

    return {
        props: { participants },
    };
};

export default ({ participants }: Props): ReactElement => {

    return (
        <div className="p-7">
            <ApplicationsOverview
                applications={participants}
            />
        </div>
    );
};
