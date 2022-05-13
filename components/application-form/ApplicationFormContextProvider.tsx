import { createTheme, ThemeProvider } from '@mui/material';
import type { ReactElement, ReactNode } from 'react';
import ApplicationFormContext from 'lib/application-form/ApplicationFormContext';
import type ApplicationType from 'lib/application-form/ApplicationType';

interface Props {
    applicationType: ApplicationType;
    children: ReactNode;
}

const ApplicationFormContextProvider = ({ applicationType, children }: Props): ReactElement => {

    // There's probably a better way to achieve this..
    const theme = createTheme({
        components: {
            MuiTextField: {
                defaultProps: {
                    style: {
                        background: 'white',
                        borderRadius: '4px',
                    },
                },
            },
        },
    });

    const formValues = new Map<string, string>();

    const setFormValue = (name: string, value: string): void => {
        formValues.set(name, value);
    };

    setFormValue('applicationType', applicationType);

    return (
        <ThemeProvider theme={theme}>
            <ApplicationFormContext.Provider value={{ formValues, setFormValue }}>
                {children}
            </ApplicationFormContext.Provider>
        </ThemeProvider>
    );
};

export default ApplicationFormContextProvider;
