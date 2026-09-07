import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import TextArea from '@/components/form/TextArea';
import { updateApplicationAllergies } from '@/lib/actions/applicationActions';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import { updateApplicationAllergiesSchema } from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

interface Props {
    application: SerializableParticipant;
}

type FormValues = z.infer<typeof updateApplicationAllergiesSchema>;

const ApplicationDetailsAllergies = ({ application: { allergies, id } }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((value) => !value), []);
    const methods = useForm<FormValues>({ resolver: zodResolver(updateApplicationAllergiesSchema) });
    const {
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;
    const onSubmit = useCallback(
        async (values: FormValues) => {
            try {
                await updateApplicationAllergies(id, values);
                toggleShowForm();
            } catch {
                setError('root', { message: 'Fehler beim Submit!' });
            }
        },
        [id, setError, toggleShowForm],
    );

    if (showForm) {
        return (
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-3xl flex-col gap-4">
                    <TextArea<FormValues> name="allergies" label="Allergien" defaultValue={allergies ?? ''} />
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
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Allergien</ApplicationDetailsTitle>
            <div className="whitespace-pre-wrap">
                {isEmptyString(allergies) ? <span className="text-gray-500">keine Angabe</span> : allergies}
            </div>
        </div>
    );
};

export default ApplicationDetailsAllergies;
