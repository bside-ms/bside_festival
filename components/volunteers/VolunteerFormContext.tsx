import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type Volunteer from 'lib/volunteers/Volunteer';

export type VolunteerFormValues = Pick<
    Volunteer,
    'fullName' |
    'mailAddress' |
    'phoneNumber' |
    'preferredMessengers' |
    'confirmedQuestions' |
    'additionalInformation'
>;

interface VolunteerFormContextData {
    formValues: VolunteerFormValues;
    setFormValue: (field: keyof VolunteerFormValues, value: string) => void;
    isSubmitting: boolean;
    toggleSubmitState: () => void;
    wasSuccessfullySubmitted: boolean;
    markFormAsSuccessfullySubmitted: () => void;
    formError: string | null;
    setFormError: (error: string) => void;
    unsetFormError: () => void;
}

const VolunteerFormContext = createContext<VolunteerFormContextData | null>(null);

const VolunteerFormContextProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [formValues, setFormValues] = useState<VolunteerFormValues>({
        fullName: '',
        phoneNumber: '',
        preferredMessengers: '',
        mailAddress: '',
        confirmedQuestions: '',
        additionalInformation: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] = useState(false);
    const [formError, setFormErrorInternal] = useState<string | null>(null);

    const setFormError = useCallback((error: string): void => setFormErrorInternal(error), []);
    const unsetFormError = (): void => setFormErrorInternal(null);

    const setFormValue = useCallback((field: keyof VolunteerFormValues, value: string): void => {
        unsetFormError();

        setFormValues(prevState => ({
            ...prevState,
            [field]: value,
        }));
    }, []);

    const toggleSubmitState = useCallback((): void => {
        setIsSubmitting(prevState => !prevState);
    }, []);

    const markFormAsSuccessfullySubmitted = useCallback((): void => {
        setWasSuccessfullySubmitted(true);
    }, [setWasSuccessfullySubmitted]);

    return (
        <VolunteerFormContext.Provider
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
        </VolunteerFormContext.Provider>
    );
};

const useVolunteerFormContext = (): VolunteerFormContextData => {

    const volunteerFormContextContext = useContext(VolunteerFormContext);

    if (volunteerFormContextContext === null) {
        throw new Error('useVolunteerFormContext must only be used within corresponding provider!');
    }

    return volunteerFormContextContext;
};

export {
    VolunteerFormContextProvider,
    useVolunteerFormContext,
};
