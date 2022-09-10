import type { ReactElement } from 'react';
import { useRegistrationFormContext } from 'components/artist/registration/RegistrationFormContext';

const RegistrationFormCancel = (): ReactElement => {

    const { handleCloseRegistration } = useRegistrationFormContext();

    return (
        <div>
            <a
                onClick={handleCloseRegistration}
                className="underline cursor-pointer text-pink-600 hover:text-pink-400"
            >
                abbrechen
            </a>
        </div>
    );
};

export default RegistrationFormCancel;
