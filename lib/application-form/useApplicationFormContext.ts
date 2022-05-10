import { useContext } from 'react';
import ApplicationFormContext from 'lib/application-form/ApplicationFormContext';
import type ApplicationFormContextValues from 'lib/application-form/ApplicationFormContextValues';

const useApplicationFormContext = (): ApplicationFormContextValues => {

    const context = useContext(ApplicationFormContext);

    if (context === undefined) {
        throw new Error('useApplicationFormContext must not be outside of ApplicationFormContextProvider');
    }

    return context;
};

export default useApplicationFormContext;
