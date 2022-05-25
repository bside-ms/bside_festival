import type ApplicationType from 'lib/application-form/ApplicationType';
import { useApplicationFormFields } from 'lib/application-form/useApplicationFormFields';

const useApplicationDetails = (type: ApplicationType, data: Record<string, string>): Array<[string, string]> => {

    const fields = useApplicationFormFields(type);

    return fields.reduce<Array<[string, string]>>(
        (prevValue, currValue) => {

            const dataPair = Object.entries(data).find(([key]) => key === currValue.name);

            if (dataPair !== undefined) {
                prevValue.push([currValue.label, dataPair[1]]);
            }

            return prevValue;
        },
        []
    );
};

export default useApplicationDetails;
