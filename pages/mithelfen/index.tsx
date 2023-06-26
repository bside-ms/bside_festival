import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
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

export default (): ReactElement | null => {
    return (
        <div>
            <div className="min-h-screen w-full relative ">
                <div className="relative z-10">

                    <div
                        className="p-5 md:p-10 w-full md:w-2/3 max-w-[700px] mx-auto drop-shadow-xl"
                    >
                        <VolunteerForm />
                    </div>

                </div>

                <Image
                    src="/assets/background.webp"
                    alt="Hintergrund"
                    className="object-cover object-top absolute z-0"
                    fill={true}
                />
            </div>

            <Footer />
        </div>
    );
};
