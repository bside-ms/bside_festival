import type { ReactElement } from 'react';
import ApplicationEyecatcher from 'components/front-page/ApplicationEyecatcher';
import FestivalSentiment from 'components/front-page/FestivalSentiment';
import PageHeader from 'components/PageHeader';

export default (): ReactElement => {

    return (
        <>
            <PageHeader theme="yellow" />

            <ApplicationEyecatcher />

            <FestivalSentiment />
        </>
    );
};
