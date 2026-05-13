import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import TextArea from '@/components/form/TextArea';
import { updateApplicationMotivation } from '@/lib/actions/applicationActions';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import { applicationMotivationMaxLength, updateApplicationMotivationSchema } from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type MotivationFormValues = z.infer<typeof updateApplicationMotivationSchema>;

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsMotivation = ({ application: { id, motivation } }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<MotivationFormValues>({ resolver: zodResolver(updateApplicationMotivationSchema) });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: MotivationFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationMotivation(id, values);
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
                    <TextArea<MotivationFormValues>
                        name="motivation"
                        label="Motivation"
                        info="Motivation"
                        maxLength={applicationMotivationMaxLength}
                        defaultValue={motivation ?? ''}
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
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Motivation</ApplicationDetailsTitle>
            <div className="whitespace-pre-wrap">
                {isNotEmptyString(motivation) ? motivation : <span className="text-gray-500">keine Angabe</span>}
            </div>
        </div>
    );
};

export default ApplicationDetailsMotivation;
