import type { ReactElement } from 'react';
import ApplicationTypeCards from 'components/application-type-selection/ApplicationTypeCards';
import PageHeader from 'components/front-page/PageHeader';

export default (): ReactElement => {

    return (
        <div className="w-full md:w-2/3 mx-auto">
            <PageHeader theme="blue" />

            <ApplicationTypeCards />
        </div>
    );
};
