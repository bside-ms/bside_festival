import type { ReactElement } from 'react';
import ApplicationEyecatcher from 'components/front-page/ApplicationEyecatcher';
import FrontPageHeader from 'components/front-page/FrontPageHeader';

export default (): ReactElement => {

    return (
        <div className="w-full md:w-2/3 mx-auto">
            <FrontPageHeader />

            <ApplicationEyecatcher />
        </div>
    );
};
