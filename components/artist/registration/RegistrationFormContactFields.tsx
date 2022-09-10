import type { ReactElement } from 'react';
import RegistrationFormTextField from 'components/artist/registration/RegistrationFormTextField';

const RegistrationFormContactFields = (): ReactElement => {

    return (
        <div className="space-y-5 md:max-w-[550px]">
            <RegistrationFormTextField
                fieldName="fullName"
                label="Vor- und Nachname"
            />

            <RegistrationFormTextField
                fieldName="mailAddress"
                label="E-Mail-Adresse"
                type="email"
            />
        </div>
    );
};

export default RegistrationFormContactFields;
