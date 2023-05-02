import type { ReactElement } from 'react';
import ApplicationForm from 'components/applications/applicationForm/ApplicationForm';

export default (): ReactElement => {

    return (
        <div className="p-7">
            <ApplicationForm />
        </div>
    );
};
