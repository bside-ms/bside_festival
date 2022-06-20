import type ApplicationType from 'lib/application-form/ApplicationType';
import { useApplicationFormFields } from 'lib/application-form/useApplicationFormFields';

const useApplicationName = (type: ApplicationType, data: Record<string, string>): string => {

    // First field is always the name field..
    const nameField = useApplicationFormFields(type)[0];
     
    return data[nameField?.name ?? ''] ?? 'n/a';
};

export default useApplicationName;
