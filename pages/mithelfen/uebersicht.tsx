import type { Volunteer } from '@prisma/client';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import VolunteersOverview from 'components/volunteers/volunteersOverview/VolunteersOverview';
import prismaClient from 'lib/common/prismaClient';
import getLegacyUserSession from 'lib/next-auth/getLegacyUserSession';

interface Props {
    volunteers: Array<Volunteer>;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context): Promise<GetServerSidePropsResult<Props>> => {

    const userSession = await getLegacyUserSession(context);

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
            <div className="py-16 min-h-screen w-full relative">
                <div className="relative z-10">
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
