import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import PageHeader from 'components/common/PageHeader';
import ApplicationEyecatcher from 'components/front-page/ApplicationEyecatcher';
import FestivalSentiment from 'components/front-page/FestivalSentiment';
import ParticipateEyecatcher from 'components/front-page/ParticipateEyecatcher';

export default (): ReactElement => {

    return (
        <>
            <PageHeader theme="yellow" />

            <ApplicationEyecatcher />

            <FestivalSentiment />

            <ParticipateEyecatcher />

            <Footer />
        </>
    );
};
