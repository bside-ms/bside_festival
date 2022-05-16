import { useCallback } from 'react';
import type { FormEvent, ReactElement, ReactNode } from 'react';
import type FormSubmitResponse from 'lib/application-form/FormSubmitResponse';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

interface Props {
    children: ReactNode;
}

const ApplicationFormWrapper = ({ children }: Props): ReactElement => {

    const {
        formValues,
        toggleSubmitState,
        markFormAsSuccessfullySubmitted,
        setFormError,
        unsetFormError,
    } = useApplicationFormContext();

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>): Promise<void> => {

        unsetFormError();

        toggleSubmitState();

        event.preventDefault();

        try {

            const response = await fetch(
                '/api/application-form/submit',
                {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(Object.fromEntries(formValues)),
                }
            );

            const responseData: FormSubmitResponse = await response.json();

            // eslint-disable-next-line no-console
            console.log('response', responseData);

            if (responseData.success) {
                markFormAsSuccessfullySubmitted();
                return;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        toggleSubmitState();

        setFormError(
            'Es ist ein unerwartetes Problem aufgetreten, versuche es bitte nochmal ' +
            'oder schreib uns eine E-Mail an festival@b-side.ms.'
        );

    }, [formValues, toggleSubmitState, unsetFormError, setFormError, markFormAsSuccessfullySubmitted]);

    return (
        <form onSubmit={handleSubmit}>
            {children}
        </form>
    );
};

export default ApplicationFormWrapper;
