import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import VolunteerForm from 'components/volunteers/volunteerForm/VolunteerForm';
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
            <div className="relative min-h-screen w-full ">
                <div className="relative z-10">
                    <div className="mx-auto w-full max-w-[700px] md:w-2/3 md:pt-2">
                        <Header />
                    </div>

                    <div className="mx-auto w-full max-w-[700px] p-5 drop-shadow-xl md:w-2/3 md:p-8">
                        <VolunteerForm />
                    </div>
                </div>

                <Image src="/assets/background.webp" alt="Hintergrund" className="absolute z-0 object-cover object-top" fill={true} />
            </div>

            <Footer />
        </div>
    );
};
