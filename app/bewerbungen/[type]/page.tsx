import type { Type } from '@prisma/client';
import type { ReactElement } from 'react';
import ApplicationForm from 'components/applications/applicationForm/ApplicationForm';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import urlPathTypes from 'lib/participants/urlPathTypes';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import { redirect } from 'next/navigation';

interface Props {
    params: {
        type: string;
    };
}

async function getData(type: string) {
    const session = await getServerSession(authOptions);

    if (session === null) {
        redirect('/');
    }

    const chosenType = urlPathTypes[type] ?? null;

    if (chosenType === null) {
        redirect('/bewerbungen');
    }

    return { chosenType };
}

export default async function BewerbungenTypePage({ params }: Props): Promise<ReactElement> {
    const { chosenType } = await getData(params.type);

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
}
