import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { isAfter, subHours } from 'date-fns';
import type { ReactElement, ReactNode } from 'react';
import type RegistrationAddRequest from 'lib/registrations/RegistrationAddRequest';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type Registration from 'lib/strapi/typings/Registration';

interface RegistrationFormContextData {
    programItem: ProgramItem | FullTimeProgramItem;
    groupOfLocation: LocationGroup | null;
    registration: Registration;
    registrationsCount: number;
    handleCloseRegistration: () => void;
    formValues: RegistrationFormValues;
    setFormValue: (field: keyof RegistrationFormValues, value: string) => void;
    isSubmitting: boolean;
    toggleSubmitState: () => void;
    wasSuccessfullySubmitted: boolean;
    markFormAsSuccessfullySubmitted: () => void;
    formError: string | null;
    setFormError: (error: string) => void;
    unsetFormError: () => void;
}

type RegistrationFormValues = Pick<RegistrationAddRequest, 'fullName' | 'mailAddress'>;

const RegistrationFormContext = createContext<RegistrationFormContextData | null>(null);

interface Props {
    registration: Registration;
    registrationsCount: number;
    programItem: ProgramItem | FullTimeProgramItem;
    groupOfLocation: LocationGroup | null;
    handleCloseRegistration: () => void;
    children: ReactNode;
}

const RegistrationFormContextProvider = ({
    registration,
    registrationsCount,
    programItem,
    groupOfLocation,
    handleCloseRegistration,
    children,
}: Props): ReactElement => {

    const [formValues, setFormValues] = useState<RegistrationFormValues>({
        fullName: '',
        mailAddress: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] = useState(false);
    const [formError, setFormErrorInternal] = useState<string | null>(null);

    const setFormError = useCallback((error: string): void => setFormErrorInternal(error), []);
    const unsetFormError = (): void => setFormErrorInternal(null);

    const setFormValue = useCallback((field: keyof RegistrationFormValues, value: string): void => {
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
        <RegistrationFormContext.Provider
            value={{
                programItem,
                groupOfLocation,
                registration,
                registrationsCount,
                handleCloseRegistration,
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
        </RegistrationFormContext.Provider>
    );
};

const useRegistrationFormContext = (): RegistrationFormContextData => {

    const registrationFormContextContext = useContext(RegistrationFormContext);

    if (registrationFormContextContext === null) {
        throw new Error('useRegistrationFormContext must only be used within corresponding provider!');
    }

    return registrationFormContextContext;
};

const useLatestRegistrationDate = (): Date => {

    const { programItem, registration } = useRegistrationFormContext();

    return useMemo(() => {

        const programBegin = new Date(programItem.attributes.Begin);

        // Contains hours subtracted from begin before registration closes
        const registrationEnd = (registration.registrationEnd ?? 0) || 1;

        return subHours(programBegin, registrationEnd);
    }, [programItem.attributes.Begin, registration.registrationEnd]);
};

const useIsRegistrationClosed = (): boolean => {

    const latestRegistrationDate = useLatestRegistrationDate();

    return isAfter(new Date(), latestRegistrationDate);
};

const useIsRegistrationBookedOut = (): boolean => {

    const { registration, registrationsCount } = useRegistrationFormContext();

    return useMemo(() => (
        registration.maxParticipants !== null && registrationsCount >= registration.maxParticipants
    ), [registration.maxParticipants, registrationsCount]);
};

export type {
    RegistrationFormValues,
};

export {
    RegistrationFormContextProvider,
    useRegistrationFormContext,
    useLatestRegistrationDate,
    useIsRegistrationClosed,
    useIsRegistrationBookedOut,
};

