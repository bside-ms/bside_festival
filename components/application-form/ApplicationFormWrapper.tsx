import { useCallback } from 'react';
import type { FormEvent, ReactElement, ReactNode } from 'react';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

interface Props {
    children: ReactNode;
}

const ApplicationFormWrapper = ({ children }: Props): ReactElement => {

    const { formValues } = useApplicationFormContext();

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>): Promise<void> => {

        event.preventDefault();

        formValues.delete('photo');

        const response = await fetch(
            '/api/application-form/submit',
            {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formValues)),
            }
        );

        // eslint-disable-next-line no-console
        console.log('response', response);

        // TODO: response handling

    }, [formValues]);

    return (
        <form onSubmit={handleSubmit}>
            {children}
        </form>
    );
};

export default ApplicationFormWrapper;
