import type ApplicationDataRow from 'lib/application-form/ApplicationDataRow';
import type ApplicationFormField from 'lib/application-form/ApplicationFormField';
import type ApplicationType from 'lib/application-form/ApplicationType';
import { useApplicationFormFields } from 'lib/application-form/useApplicationFormFields';

const useApplicationDetails = (type: ApplicationType, data: Record<string, string>): Array<ApplicationDataRow> => {

    const fields = useApplicationFormFields(type);

    return fields.map<ApplicationFormField & { value: string | null }>(
        (field) => {

            const dataPair = Object.entries(data).find(([key]) => key === field.name);

            const value = dataPair === undefined ? null : dataPair[1];

            return { ...field, value };
        }
    ).filter(
        (field): field is ApplicationDataRow => field.value !== null
    );
};

export default useApplicationDetails;
