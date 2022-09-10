import type { ReactElement } from 'react';
import RegistrationFormCancel from 'components/artist/registration/RegistrationFormCancel';
import RegistrationFormConsentAgreementCheckbox from 'components/artist/registration/RegistrationFormConsentAgreementCheckbox';
import RegistrationFormContactFields from 'components/artist/registration/RegistrationFormContactFields';
import RegistrationFormError from 'components/artist/registration/RegistrationFormError';
import RegistrationFormInfo from 'components/artist/registration/RegistrationFormInfo';
import RegistrationFormPrivacyTermsCheckbox from 'components/artist/registration/RegistrationFormPrivacyTermsCheckbox';
import RegistrationFormSubmitButton from 'components/artist/registration/RegistrationFormSubmitButton';

const RegistrationFormContents = (): ReactElement => {

    return (
        <div className="max-w-xl border-pink-300 border rounded p-5">
            <RegistrationFormInfo />

            <RegistrationFormContactFields />

            <div className="my-3 space-y-3">
                <RegistrationFormConsentAgreementCheckbox />
                <RegistrationFormPrivacyTermsCheckbox />
            </div>

            <RegistrationFormError />

            <div className="mt-4 flex gap-12 items-center">
                <RegistrationFormSubmitButton />
                <RegistrationFormCancel />
            </div>
        </div>
    );
};

export default RegistrationFormContents;
