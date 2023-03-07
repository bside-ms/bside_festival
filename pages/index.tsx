import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import PageHeader from 'components/common/PageHeader';
import FestivalSentiment from 'components/front-page/FestivalSentiment';
import FrontPageEyeCatchers from 'components/front-page/FrontPageEyeCatchers';
import ParticipateEyecatcher from 'components/front-page/ParticipateEyecatcher';
import TeamImageEyeCatcher from 'components/front-page/TeamImageEyeCatcher';

export default (): ReactElement => {

    return (
        <>
            <PageHeader theme="yellow" />

            <FrontPageEyeCatchers />

            <FestivalSentiment />

            <TeamImageEyeCatcher />

            <ParticipateEyecatcher />

            <Footer />
        </>
    );
};
