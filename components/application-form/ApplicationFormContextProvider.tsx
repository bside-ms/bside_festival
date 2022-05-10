import type { ReactElement, ReactNode } from 'react';
import ApplicationFormContext from 'lib/application-form/ApplicationFormContext';
import type ApplicationType from 'lib/application-form/ApplicationType';

interface Props {
    applicationType: ApplicationType;
    children: ReactNode;
}

const ApplicationFormContextProvider = ({ applicationType, children }: Props): ReactElement => {

    const formValues = new Map<string, string>();

    const setFormValue = (name: string, value: string): void => {
        formValues.set(name, value);
    };

    setFormValue('applicationType', applicationType);

    return (
        <ApplicationFormContext.Provider value={{ formValues, setFormValue }}>
            {children}
        </ApplicationFormContext.Provider>
    );
};

export default ApplicationFormContextProvider;
