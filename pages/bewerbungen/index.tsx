import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import ApplicationForm from 'components/applications/applicationForm/ApplicationForm';
import Footer from 'components/common/Footer';
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

                    <div
                        className="p-5 md:p-10 w-full md:w-2/3 max-w-[700px] mx-auto drop-shadow-xl"
                    >
                        <ApplicationForm />
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};
