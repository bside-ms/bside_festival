import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import SelectInput from '@/components/form/SelectInput';
import TextInput from '@/components/form/TextInput';
import { updateApplicationDurationPreference } from '@/lib/actions/applicationActions';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import { updateApplicationDurationPreferenceSchema } from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import { Type } from '@prisma/client';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type DurationPreferenceFormValues = z.infer<typeof updateApplicationDurationPreferenceSchema>;

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsDuration = ({ application: { durationPreference, id, type } }: Props): ReactElement | null => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<DurationPreferenceFormValues>({ resolver: zodResolver(updateApplicationDurationPreferenceSchema) });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: DurationPreferenceFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationDurationPreference(id, values);
                toggleShowForm();
            } catch {
                setError('root', { message: 'Fehler beim Submit!' });
            }
        },
        [clearErrors, id, setError, toggleShowForm],
    );

    if (type === Type.InfoBooth || type === Type.Exhibition) {
        return null;
    }

    const title = type === Type.Concert ? 'Bevorzugte Spielzeit' : 'Gewünschte Dauer';
    const duration = isEmptyString(durationPreference)
        ? null
        : type === Type.Concert
          ? `${durationPreference} Minuten`
          : durationPreference;

    if (showForm) {
        const durationOptions = ['15', '30', '45', '60', '75', '90'];

        return (
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-3xl flex-col gap-4">
                    {type === Type.Concert ? (
                        <SelectInput<DurationPreferenceFormValues>
                            name="durationPreference"
                            label={title}
                            info={title}
                            required={true}
                            defaultValue={durationPreference ?? ''}
                            options={durationOptions.map((option) => ({ value: option, label: option }))}
                        />
                    ) : (
                        <TextInput<DurationPreferenceFormValues>
                            name="durationPreference"
                            label={title}
                            info={title}
                            required={true}
                            defaultValue={durationPreference ?? ''}
                        />
                    )}

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
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>{title}</ApplicationDetailsTitle>
            <div>{duration ?? <span className="text-gray-500">keine Angabe</span>}</div>
        </div>
    );
};

export default ApplicationDetailsDuration;
