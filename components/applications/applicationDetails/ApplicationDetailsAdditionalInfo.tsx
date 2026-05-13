import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import TextArea from '@/components/form/TextArea';
import { updateApplicationAdditionalInfo } from '@/lib/actions/applicationActions';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import { applicationAdditionalInfoMaxLength, updateApplicationAdditionalInfoSchema } from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type AdditionalInfoFormValues = z.infer<typeof updateApplicationAdditionalInfoSchema>;

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsAdditionalInfo = ({ application: { additionalInfo, id } }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<AdditionalInfoFormValues>({ resolver: zodResolver(updateApplicationAdditionalInfoSchema) });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: AdditionalInfoFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationAdditionalInfo(id, values);
                toggleShowForm();
            } catch {
                setError('root', { message: 'Fehler beim Submit!' });
            }
        },
        [clearErrors, id, setError, toggleShowForm],
    );

    if (showForm) {
        return (
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-3xl flex-col gap-4">
                    <TextArea<AdditionalInfoFormValues>
                        name="additionalInfo"
                        label="Weitere Infos"
                        info="Weitere Infos"
                        maxLength={applicationAdditionalInfoMaxLength}
                        defaultValue={additionalInfo ?? ''}
                    />

                    <ApplicationDetailsFormControls
                        errorMessage={errors.root?.message}
                        isSubmitting={isSubmitting}
                        onCancel={toggleShowForm}
                    />
                </form>
            </FormProvider>
        );
    }

    return (
        <div>
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Weitere Infos</ApplicationDetailsTitle>
            <div className="whitespace-pre-wrap">
                {isNotEmptyString(additionalInfo) ? additionalInfo : <span className="text-gray-500">keine Angabe</span>}
            </div>
        </div>
    );
};

export default ApplicationDetailsAdditionalInfo;
