import type ApplicationFormField from 'lib/application-form/ApplicationFormField';

type ApplicationDataRow = ApplicationFormField & { value: string };

export default ApplicationDataRow;
