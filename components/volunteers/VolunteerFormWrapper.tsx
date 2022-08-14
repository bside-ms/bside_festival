import { useCallback } from 'react';
import type { FormEvent, ReactElement, ReactNode } from 'react';
import { useVolunteerFormContext } from 'components/volunteers/VolunteerFormContext';
import type FormSubmitResponse from 'lib/application-form/FormSubmitResponse';

interface Props {
    children: ReactNode;
}

const VolunteerFormWrapper = ({ children }: Props): ReactElement => {

    const {
        formValues,
        toggleSubmitState,
        markFormAsSuccessfullySubmitted,
        setFormError,
        unsetFormError,
    } = useVolunteerFormContext();

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>): Promise<void> => {

        unsetFormError();

        toggleSubmitState();

        event.preventDefault();

        try {

            const response = await fetch(
                '/api/volunteers/add',
                {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(formValues),
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

        setFormError(`
            Es ist ein unerwartetes Problem aufgetreten, versuche es bitte nochmal 
            oder schreib uns eine E-Mail an festival@b-side.ms.
        `);

    }, [formValues, toggleSubmitState, unsetFormError, setFormError, markFormAsSuccessfullySubmitted]);

    return (
        <form onSubmit={handleSubmit}>
            {children}
        </form>
    );
};

export default VolunteerFormWrapper;
