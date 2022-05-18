import type { ReactElement } from 'react';
import BHeartSvg from 'components/common/BHeartSvg';
import Footer from 'components/common/Footer';
import PageHeader from 'components/common/PageHeader';
import ApplicationEyecatcher from 'components/front-page/ApplicationEyecatcher';
import FestivalSentiment from 'components/front-page/FestivalSentiment';

export default (): ReactElement => {

    return (
        <>
            <PageHeader theme="yellow" />

            <ApplicationEyecatcher />

            <FestivalSentiment />

            <BHeartSvg size={30} color="#000" />

            <Footer />
        </>
    );
};
