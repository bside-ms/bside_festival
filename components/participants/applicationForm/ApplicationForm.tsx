
import { useCallback } from 'react';
import type { Prisma, Type } from '@prisma/client';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import SelectInput from 'components/form/SelectInput';
import TextInput from 'components/form/TextInput';
import typeLabels from 'lib/participants/typeLabels';
import type { AddParticipantRequest, SuccessfulAddParticipantResponse } from 'pages/api/participants/add';

export interface FormValues {
    type: Type;
    name: string;
    contactName: string;
    contactPhone: string;
}

interface Props {
    onSuccessfulFormSubmit: (newParticipant: Prisma.ParticipantGetPayload<Prisma.ParticipantFindManyArgs>) => void;
}

const ApplicationForm = ({ onSuccessfulFormSubmit }: Props): ReactElement => {

    const { register, handleSubmit, setError, formState, clearErrors, reset } = useForm<FormValues>();

    const handleFormSubmit = useCallback(async (values: FormValues) => {

        clearErrors('root');

        const request: AddParticipantRequest = values;

        const response = await fetch('/api/participants/add', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            setError('root', { message: 'Fehler beim Submit!' });
            return;
        }

        const { newParticipant } = await response.json() as SuccessfulAddParticipantResponse;

        onSuccessfulFormSubmit(newParticipant);

        reset();

    }, [clearErrors, onSuccessfulFormSubmit, reset, setError]);

    const availableTypes = new Array<Type>(
        'Concert',
        'Workshop',
        'Reading',
        'Performance',
        'FamilyProgram',
        'Exhibition',
        'Food',
        'Neighbor',
        'Misc',
    );

    return (
        <div className="mt-4">
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                noValidate={true}
                className="flex gap-3 flex-col"
            >
                <SelectInput<FormValues>
                    name="type"
                    label="Typ"
                    options={availableTypes.map(type => ({ value: type, label: typeLabels[type] }))}
                    required={true}
                    register={register}
                    errors={formState.errors}
                />

                <TextInput<FormValues>
                    name="name"
                    label="Name"
                    required={true}
                    maxLength={50}
                    register={register}
                    errors={formState.errors}
                />

                <TextInput<FormValues>
                    name="contactName"
                    label="Kontaktperson"
                    register={register}
                    errors={formState.errors}
                />

                <TextInput<FormValues>
                    name="contactPhone"
                    label="Kontaktperson"
                    register={register}
                    errors={formState.errors}
                />

                <div>
                    <button type="submit" className="mt-2 bg-pink-600 text-white rounded px-4 py-1">
                        Senden
                    </button>
                </div>
            </form>

            {formState.errors.root && (
                <div className="mt-2 text-red-600">
                    {formState.errors.root.message}
                </div>
            )}
        </div>
    );
};

export default ApplicationForm;
