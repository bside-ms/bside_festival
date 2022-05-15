import type { ReactElement } from 'react';
import ApplicationTypeCards from 'components/application-type-selection/ApplicationTypeCards';
import PageHeader from 'components/PageHeader';

export default (): ReactElement => {

    return (
        <>
            <PageHeader theme="blue" />

            <ApplicationTypeCards />
        </>
    );
};
