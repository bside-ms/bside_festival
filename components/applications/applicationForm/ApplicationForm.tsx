
import { useCallback } from 'react';
import type { Type } from '@prisma/client';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import SelectInput from 'components/form/SelectInput';
import TextArea from 'components/form/TextArea';
import TextInput from 'components/form/TextInput';
import typeLabels from 'lib/participants/typeLabels';
import type { AddParticipantRequest } from 'pages/api/applications/add';

export interface ApplicationFormValues {
    type: Type;
    name: string;
    contactName: string;
    contactPhone: string;
    contactMail: string;
    description: string;
}

const ApplicationForm = (): ReactElement => {

    const methods = useForm<ApplicationFormValues>();
    const { handleSubmit, setError, formState, clearErrors, reset } = methods;

    const handleFormSubmit = useCallback(async (values: ApplicationFormValues) => {

        clearErrors('root');

        const request: AddParticipantRequest = values;

        const response = await fetch('/api/applications/add', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            setError('root', { message: 'Fehler beim Submit!' });
            return;
        }

        reset();

    }, [clearErrors, reset, setError]);

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
        // eslint-disable-next-line react/jsx-props-no-spreading
        <FormProvider {...methods}>
            <div className="mt-4 max-w-xl">
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    noValidate={true}
                    className="flex gap-3 flex-col"
                >
                    <SelectInput<ApplicationFormValues>
                        name="type"
                        label="Kategorie"
                        options={availableTypes.map(type => ({ value: type, label: typeLabels[type] }))}
                        required={true}
                    />

                    <TextInput<ApplicationFormValues>
                        name="name"
                        label="Name"
                        required={true}
                        maxLength={100}
                    />

                    <TextInput<ApplicationFormValues>
                        name="contactName"
                        label="Ansprechperson"
                    />

                    <TextInput<ApplicationFormValues>
                        name="contactPhone"
                        label="Telefonnummer"
                    />

                    <TextInput<ApplicationFormValues>
                        name="contactMail"
                        label="E-Mail-Adresse"
                    />

                    <TextArea<ApplicationFormValues>
                        name="description"
                        label="Beschreibung"
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
        </FormProvider>
    );
};

export default ApplicationForm;
