import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import SelectInput from '@/components/form/SelectInput';
import { updateApplicationPastParticipation } from '@/lib/actions/applicationActions';
import { updateApplicationPastParticipationSchema } from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type PastParticipationFormValues = z.infer<typeof updateApplicationPastParticipationSchema>;

interface Props {
    application: SerializableParticipant;
}

const getPastParticipationFormValue = (
    hasParticipatedBefore: boolean | null | undefined,
): PastParticipationFormValues['hasParticipatedBefore'] => {
    if (hasParticipatedBefore === null || hasParticipatedBefore === undefined) {
        return 'unknown';
    }

    return hasParticipatedBefore ? 'yes' : 'no';
};

const ApplicationDetailsPastParticipation = ({ application: { hasParticipatedBefore, id } }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<PastParticipationFormValues>({ resolver: zodResolver(updateApplicationPastParticipationSchema) });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: PastParticipationFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationPastParticipation(id, values);
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
                    <ApplicationDetailsTitle>Bisherige Teilnahme am Festival</ApplicationDetailsTitle>

                    <SelectInput<PastParticipationFormValues>
                        name="hasParticipatedBefore"
                        label="Bisherige Teilnahme"
                        defaultValue={getPastParticipationFormValue(hasParticipatedBefore)}
                        options={[
                            { value: 'unknown', label: 'keine Angabe' },
                            { value: 'yes', label: 'ja' },
                            { value: 'no', label: 'nein' },
                        ]}
                        required={true}
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
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Bisherige Teilnahme am Festival</ApplicationDetailsTitle>
            <div>
                {hasParticipatedBefore === null || hasParticipatedBefore === undefined
                    ? 'keine Angabe'
                    : hasParticipatedBefore
                      ? 'ja'
                      : 'nein'}
            </div>
        </div>
    );
};

export default ApplicationDetailsPastParticipation;
