import type { ReactElement } from 'react';
import ApplicationForm from 'components/application-form/ApplicationForm';

const Bewerbung = (): ReactElement => {

    return (
        <div className="min-h-full w-full md:w-2/3 mx-auto">
            <ApplicationForm />
        </div>
    );
};

export default Bewerbung;
