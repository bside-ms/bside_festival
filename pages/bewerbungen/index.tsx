import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import ApplicationTypeSelection from 'components/applications/applicationForm/ApplicationTypeSelection';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import getUserSession from 'lib/next-auth/getUserSession';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userSession = await getUserSession(context);

    if (userSession === null) {
        return {
            redirect: {
                statusCode: 302,
                destination: '/',
            },
        };
    }

    return { props: {} };
};

export default (): ReactElement => {
    return (
        <div>
            <div className="min-h-screen w-full relative ">
                <div className="relative z-10">
                    <div className="w-full md:w-2/3 md:pt-2 max-w-[700px] mx-auto">
                        <Header />
                    </div>

                    <div className="p-5 md:p-8 w-full md:w-2/3 max-w-[700px] mx-auto drop-shadow-xl">
                        <div className="w-full flex gap-6 flex-col">
                            <div className="text-black font-display">
                                <div className="text-4xl font-bold">Bewerbung</div>
                            </div>

                            <div className="text-black font-bold">
                                Auf dem B-Side Festival gibt es viele verschiedenen Formate. Damit wir den Überblick behalten, haben wir auf
                                dieser Seite verschiedene Bewerbungsformulare zusammengestellt. Sucht euch einfach das Genre aus, das am
                                ehesten zu eurem Programmpunkt passt.
                            </div>

                            <ApplicationTypeSelection />
                        </div>
                    </div>
                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
