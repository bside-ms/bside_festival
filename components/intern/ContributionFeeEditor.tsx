'use client';

import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import TextInput from '@/components/form/TextInput';
import { updateApplicationFeeEuros } from '@/lib/actions/applicationActions';
import { formatFeeEuros } from '@/lib/changeLog/changeLogLabels';
import { updateApplicationFeeEurosSchema } from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type FeeEurosFormValues = z.output<typeof updateApplicationFeeEurosSchema>;

interface Props {
    application: SerializableParticipant;
}

const ContributionFeeEditor = ({ application: { feeEuros, id } }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<FeeEurosFormValues>({
        defaultValues: { feeEuros },
        resolver: zodResolver(updateApplicationFeeEurosSchema),
    });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: FeeEurosFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationFeeEuros(id, values);
                toggleShowForm();
            } catch {
                setError('root', { message: 'Fehler beim Submit!' });
            }
        },
        [clearErrors, id, setError, toggleShowForm],
    );

    if (showForm) {
        return (
            <div className="space-y-2">
                <div className="font-display text-xl">Gage</div>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex flex-col gap-3">
                        <TextInput<FeeEurosFormValues>
                            name="feeEuros"
                            label="Gage in Euro"
                            info="Betrag in Euro"
                            type="number"
                            min={0}
                            additionalInfo="Leer lassen, um die Gage zu entfernen."
                            defaultValue={feeEuros === null ? '' : feeEuros.toString()}
                        />

                        <ApplicationDetailsFormControls
                            errorMessage={errors.root?.message}
                            isSubmitting={isSubmitting}
                            onCancel={toggleShowForm}
                        />
                    </form>
                </FormProvider>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Gage</ApplicationDetailsTitle>
            <div className="text-sm">{formatFeeEuros(feeEuros)}</div>
        </div>
    );
};

export default ContributionFeeEditor;
