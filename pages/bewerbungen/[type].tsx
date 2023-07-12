import type { Type } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import ApplicationForm from 'components/applications/applicationForm/ApplicationForm';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import getUserSession from 'lib/next-auth/getUserSession';
import urlPathTypes from 'lib/participants/urlPathTypes';
 
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

    const type = context.params?.type as string | undefined;

    const chosenType = urlPathTypes[type ?? ''] ?? null;

    if (chosenType === null) {
        return {
            redirect: {
                statusCode: 302,
                destination: '/bewerbungen',
            },
        };
    }

    return {
        props: {
            chosenType,
        },
    };
};

interface Props {
    chosenType: Type;
}

export default ({ chosenType }: Props): ReactElement => {

    return (
        <div>
            <div className="min-h-screen w-full relative ">
                <div className="relative z-10">

                    <div
                        className="p-5 md:p-10 w-full md:w-2/3 max-w-[700px] mx-auto drop-shadow-xl"
                    >
                        <ApplicationForm chosenType={chosenType} />
                    </div>

                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
