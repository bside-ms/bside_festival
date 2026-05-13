import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import TextInput from '@/components/form/TextInput';
import { updateApplicationParticipantCount } from '@/lib/actions/applicationActions';
import { updateApplicationParticipantCountSchema } from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type ParticipantCountFormValues = z.infer<typeof updateApplicationParticipantCountSchema>;

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsParticipantCount = ({ application: { id, participantCount } }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<ParticipantCountFormValues>({ resolver: zodResolver(updateApplicationParticipantCountSchema) });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: ParticipantCountFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationParticipantCount(id, values);
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
                    <TextInput<ParticipantCountFormValues>
                        name="participantCount"
                        label="Personenanzahl"
                        info="Personenanzahl"
                        type="number"
                        required={true}
                        defaultValue={participantCount.toString()}
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
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Personenanzahl</ApplicationDetailsTitle>
            <div>{participantCount}</div>
        </div>
    );
};

export default ApplicationDetailsParticipantCount;
