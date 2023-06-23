// import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import Footer from 'components/common/Footer';
import PageHeader from 'components/common/PageHeader';
import VolunteersOverview from 'components/volunteers/overview/VolunteersOverview';
// import getUserSession from 'lib/next-auth/getUserSession';

// interface Props {
//     valunteers: Array<>;
// }

// export const getServerSideProps: GetServerSideProps<Props> = async (context): Promise<GetServerSidePropsResult<Props>> => {
//     const userSession = await getUserSession(context);
    
//     if (userSession === null) {
//         return {
//             redirect: {
//                 statusCode: 302,
//                 destination: '/',
//             },
//         };
//     }
// }; 

export default (): ReactElement | null => {

    return (
        <>
            <PageHeader theme="pink" symbols="none" />

            <div className="py-40 min-h-screen">
                <ContentWrapper>
                    <VolunteersOverview />
                </ContentWrapper>

            </div>
            <Footer />
        </>
    );
};
