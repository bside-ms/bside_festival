import { useCallback } from 'react';
import type { FormEvent, ReactElement, ReactNode } from 'react';
import RegistrationBookedOutHint from 'components/artist/registration/RegistrationBookedOutHint';
import RegistrationClosedHint from 'components/artist/registration/RegistrationClosedHint';
import { useIsRegistrationBookedOut, useIsRegistrationClosed, useRegistrationFormContext } from 'components/artist/registration/RegistrationFormContext';
import RegistrationSuccessfullySubmittedHint from 'components/artist/registration/RegistrationSuccessfullySubmittedHint';
import type FormSubmitResponse from 'lib/application-form/FormSubmitResponse';
import type RegistrationAddRequest from 'lib/registrations/RegistrationAddRequest';

interface Props {
    children: ReactNode;
}

const RegistrationFormWrapper = ({ children }: Props): ReactElement => {

    const {
        formValues,
        toggleSubmitState,
        markFormAsSuccessfullySubmitted,
        setFormError,
        unsetFormError,
        wasSuccessfullySubmitted,
        programItem,
        groupOfLocation,
    } = useRegistrationFormContext();

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>): Promise<void> => {

        unsetFormError();

        toggleSubmitState();

        event.preventDefault();

        try {
            const addRequest: RegistrationAddRequest = {
                ...formValues,
                programItem,
                groupOfLocation,
            };

            const response = await fetch(
                '/api/registrations/register',
                {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(addRequest),
                }
            );

            const responseData: FormSubmitResponse = await response.json();

            if (responseData.success) {
                markFormAsSuccessfullySubmitted();
                return;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        toggleSubmitState();

        setFormError(`
            Es ist ein unerwartetes Problem aufgetreten, versuche es bitte nochmal 
            oder schreib uns eine E-Mail an festival@b-side.ms.
        `);

    }, [unsetFormError, toggleSubmitState, setFormError, formValues, programItem, groupOfLocation, markFormAsSuccessfullySubmitted]);

    const isRegistrationClosed = useIsRegistrationClosed();
    const isRegistrationBookedOut = useIsRegistrationBookedOut();

    if (isRegistrationClosed) {
        return <RegistrationClosedHint />;
    }

    if (isRegistrationBookedOut) {
        return <RegistrationBookedOutHint />;
    }

    if (wasSuccessfullySubmitted) {
        return <RegistrationSuccessfullySubmittedHint />;
    }

    return (
        <form onSubmit={handleSubmit}>
            {children}
        </form>
    );
};

export default RegistrationFormWrapper;
