import type { Volunteer } from '@prisma/client';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import VolunteersOverview from 'components/volunteers/volunteersOverview/VolunteersOverview';
import prismaClient from 'lib/common/prismaClient';
import getUserSession from 'lib/next-auth/getUserSession';

interface Props {
    volunteers: Array<Volunteer>;
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

    const volunteers = await prismaClient.volunteer.findMany();

    return {
        props: {
            volunteers,
        },
    };
};

export default ({ volunteers }: Props): ReactElement => {
    return (
        <div>
            <div className="pb-16 min-h-screen w-full relative">
                <div className="relative z-10">
                    <div className="p-3 max-w-2xl mx-auto">
                        <Header />
                    </div>

                    <div className="px-3 max-w-2xl mx-auto">
                        <VolunteersOverview volunteers={volunteers} />
                    </div>
                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
