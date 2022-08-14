import type { ReactElement } from 'react';
import { useVolunteerFormContext } from 'components/volunteers/VolunteerFormContext';

const VolunteerFormError = (): ReactElement | null => {

    const { formError } = useVolunteerFormContext();

    if (formError === null) {
        return null;
    }

    return (
        <div className="text-red-500 my-4">
            {formError}
        </div>
    );
};

export default VolunteerFormError;
