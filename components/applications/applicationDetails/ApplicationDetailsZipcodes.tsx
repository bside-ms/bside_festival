import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import Checkbox from '@/components/form/Checkbox';
import TextInput from '@/components/form/TextInput';
import { updateApplicationZipcodes } from '@/lib/actions/applicationActions';
import { updateApplicationZipcodesSchema } from '@/lib/schemas/applicationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Zipcode } from '@prisma/client';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import type { z } from 'zod';

interface Props {
    participantId: number;
    zipcodes: Array<Zipcode>;
}

type FormValues = z.infer<typeof updateApplicationZipcodesSchema>;

interface ZipcodeRowProps {
    index: number;
    onRemove: (index: number) => void;
}

const ZipcodeRow = ({ index, onRemove }: ZipcodeRowProps): ReactElement => {
    const handleRemove = useCallback(() => onRemove(index), [index, onRemove]);
    return (
        <div className="flex items-end gap-2">
            <TextInput<FormValues> name={`zipcodes.${index}.code`} label={index === 0 ? 'PLZ oder Land' : `Wohnort #${index + 1}`} />
            <Checkbox name={`zipcodes.${index}.isInternational`} label="Land" />
            <button type="button" className="mb-2 text-red-600" onClick={handleRemove}>
                löschen
            </button>
        </div>
    );
};

const ZipcodeEditor = (): ReactElement => {
    const { control } = useFormContext<FormValues>();
    const { fields, append, remove } = useFieldArray({ control, name: 'zipcodes' });
    const handleAppend = useCallback(() => append({ code: '', isInternational: false }), [append]);
    return (
        <div className="space-y-2">
            {fields.map((field, index) => (
                <ZipcodeRow key={field.id} index={index} onRemove={remove} />
            ))}
            <button type="button" className="text-sky-500" onClick={handleAppend}>
                Wohnort hinzufügen
            </button>
        </div>
    );
};

const ApplicationDetailsZipcodes = ({ participantId, zipcodes }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((value) => !value), []);
    const methods = useForm<FormValues>({
        defaultValues: { zipcodes: zipcodes.map(({ code, isInternational }) => ({ code, isInternational })) },
        resolver: zodResolver(updateApplicationZipcodesSchema),
    });
    const {
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;
    const onSubmit = useCallback(
        async (values: FormValues) => {
            try {
                await updateApplicationZipcodes(participantId, values);
                toggleShowForm();
            } catch {
                setError('root', { message: 'Fehler beim Submit!' });
            }
        },
        [participantId, setError, toggleShowForm],
    );

    if (showForm) {
        return (
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <ZipcodeEditor />
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
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Wohnorte</ApplicationDetailsTitle>
            <div className="flex flex-wrap gap-2">
                {zipcodes.length === 0 ? (
                    <span className="text-gray-500">keine Angabe</span>
                ) : (
                    zipcodes.map(({ id, code, isInternational }) => (
                        <span key={id} className="rounded bg-gray-400/20 px-2 py-1 text-sm">
                            {isInternational ? 'Land' : 'PLZ'}: {code}
                        </span>
                    ))
                )}
            </div>
        </div>
    );
};

export default ApplicationDetailsZipcodes;
