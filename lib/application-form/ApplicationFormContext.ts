import { createContext } from 'react';
import type ApplicationFormContextValues from 'lib/application-form/ApplicationFormContextValues';

const ApplicationFormContext = createContext<ApplicationFormContextValues | undefined>(undefined);

export default ApplicationFormContext;
