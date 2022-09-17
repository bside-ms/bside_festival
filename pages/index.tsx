import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import PageHeader from 'components/common/PageHeader';
import FestivalSentiment from 'components/front-page/FestivalSentiment';
import FrontPageEyeCatchers from 'components/front-page/FrontPageEyeCatchers';
import ParticipateEyecatcher from 'components/front-page/ParticipateEyecatcher';
import PageAlert from 'components/common/PageAlert';

export default (): ReactElement => {

    return (
        <>
            <PageAlert />

            <PageHeader theme="yellow" />

            <FrontPageEyeCatchers />

            <FestivalSentiment />

            <ParticipateEyecatcher />

            <Footer />
        </>
    );
};
