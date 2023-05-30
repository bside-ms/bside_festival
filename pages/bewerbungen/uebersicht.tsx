import type { Link } from '@prisma/client';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/applications/applicationsOverview/ApplicationsOverview';
import { ApplicationsOverviewContextProvider } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import ContentWrapper from 'components/common/ContentWrapper';
import Footer from 'components/common/Footer';
import PageHeader from 'components/common/PageHeader';
import prismaClient from 'lib/common/prismaClient';
import getUserSession from 'lib/next-auth/getUserSession';
import type { SerializableParticipant } from 'pages/bewerbungen/[idAndName]';

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
            applications: applications.map(application => ({
                ...application,
                appliedAt: application.appliedAt?.toString() ?? null,
                updatedAt: application.updatedAt.toString(),
            })),
            allLinks,
        },
    };
};

export default ({ applications, allLinks }: Props): ReactElement => {

    return (
        <>
            <PageHeader theme="pink" symbols="none" />

            <div className="py-40">
                <ContentWrapper>
                    <ApplicationsOverviewContextProvider
                        applications={applications}
                        allLinks={allLinks}
                    >
                        <ApplicationsOverview />
                    </ApplicationsOverviewContextProvider>
                </ContentWrapper>
            </div>

            <Footer />
        </>
    );
};
