import { createTheme, ThemeProvider } from '@mui/material';
import type { ReactElement, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const VolunteerFormThemeProvider = ({ children }: Props): ReactElement => {

    const theme = createTheme({
        typography: {
            fontFamily: '"Questrial", "sans-serif"',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};

export default VolunteerFormThemeProvider;
