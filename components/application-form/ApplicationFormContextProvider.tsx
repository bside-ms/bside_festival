import { useCallback, useEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import ApplicationFormContext from 'lib/application-form/ApplicationFormContext';
import type ApplicationType from 'lib/application-form/ApplicationType';

interface Props {
    applicationType: ApplicationType;
    children: ReactNode;
}

const ApplicationFormContextProvider = ({ applicationType, children }: Props): ReactElement => {

    const [formValues, setFormValues] = useState(new Map<string, string>());

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] = useState(false);
    const [formError, setFormErrorInternal] = useState<string | null>(null);

    const setFormError = (error: string): void => setFormErrorInternal(error);
    const unsetFormError = (): void => setFormErrorInternal(null);

    const setFormValue = useCallback((name: string, value: string): void => {
        unsetFormError();

        setFormValues(formValues.set(name, value));
    }, [formValues]);

    const toggleSubmitState = useCallback((): void => {
        setIsSubmitting(prevState => !prevState);
    }, []);

    const markFormAsSuccessfullySubmitted = useCallback((): void => {
        setWasSuccessfullySubmitted(true);
    }, [setWasSuccessfullySubmitted]);

    useEffect(
        () => setFormValue('applicationType', applicationType),
        [setFormValue, applicationType]
    );

    return (
        <ApplicationFormContext.Provider
            value={{
                formValues,
                setFormValue,
                isSubmitting,
                toggleSubmitState,
                wasSuccessfullySubmitted,
                markFormAsSuccessfullySubmitted,
                formError,
                setFormError,
                unsetFormError,
            }}
        >
            {children}
        </ApplicationFormContext.Provider>
    );
};

export default ApplicationFormContextProvider;
