import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/applications/ApplicationsOverview';
import NextHead from 'components/common/NextHead';

export default (): ReactElement => {

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Bewerbungsübersicht" />

            <ApplicationsOverview />
        </>
    );
};
