import type { Type } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import ApplicationForm from 'components/applications/applicationForm/ApplicationForm';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import urlPathTypes from 'lib/participants/urlPathTypes';

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
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
            <div className="relative min-h-screen w-full ">
                <div className="relative z-10">
                    <div className="mx-auto w-full max-w-[700px] md:w-2/3 md:pt-2">
                        <Header />
                    </div>

                    <div className="mx-auto w-full max-w-[700px] p-5 drop-shadow-xl md:w-2/3 md:p-8">
                        <ApplicationForm chosenType={chosenType} />
                    </div>
                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
