import type { ReactElement } from 'react';
import ApplicationEyecatcher from 'components/front-page/ApplicationEyecatcher';
import PageHeader from 'components/PageHeader';

export default (): ReactElement => {

    return (
        <div className="w-full md:w-2/3 mx-auto">
            <PageHeader theme="yellow" />

            <ApplicationEyecatcher />
        </div>
    );
};
