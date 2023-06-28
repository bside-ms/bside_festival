import type { Link } from '@prisma/client';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/applications/applicationsOverview/ApplicationsOverview';
import { ApplicationsOverviewContextProvider } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import serializeApplication from 'lib/applications/serializeApplication';
import prismaClient from 'lib/common/prismaClient';
import getUserSession from 'lib/next-auth/getUserSession';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    applications: Array<SerializableParticipant>;
    allLinks: Array<Link>;
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

    const applications = await prismaClient.participant.findMany();

    const allLinks = await prismaClient.link.findMany();

    return {
        props: {
            applications: applications.map(serializeApplication),
            allLinks,
        },
    };
};

export default ({ applications, allLinks }: Props): ReactElement => {

    return (
        <div>
            <div className="py-16 min-h-screen w-full relative">
                <div className="relative z-10">
                    <div className="px-3 max-w-7xl mx-auto">
                        <ApplicationsOverviewContextProvider
                            applications={applications}
                            allLinks={allLinks}
                        >
                            <ApplicationsOverview />
                        </ApplicationsOverviewContextProvider>
                    </div>
                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
