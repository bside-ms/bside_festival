import { Checkbox } from '@mui/material';
import type { ReactElement } from 'react';
import { useRegistrationFormContext } from 'components/artist/registration/RegistrationFormContext';

const RegistrationFormConsentAgreementCheckbox = (): ReactElement | null => {

    const context = useRegistrationFormContext();

    if (context.registration.concentAgreement === null || context.registration.concentAgreement === '') {
        return null;
    }

    const name = 'consentAgreement';

    return (
        <div className="flex">
            <div>
                <Checkbox
                    id={name}
                    required={true}
                    sx={{ paddingY: 0, paddingX: 1 }}
                    disabled={context.isSubmitting}
                />
            </div>

            <div>
                <label htmlFor={name}>
                    Hiermit nehme ich folgenden Hinweis zur Kenntnis: {context.registration.concentAgreement} *
                </label>
            </div>
        </div>
    );
};

export default RegistrationFormConsentAgreementCheckbox;
