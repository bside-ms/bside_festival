'use client';

import ApplicationDetailsEditButton from '@/components/applications/applicationDetails/ApplicationDetailsEditButton';
import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import MultiSelectInput from '@/components/form/MultiSelectInput';
import { updateApplicationTypeAndGenres } from '@/lib/actions/applicationActions';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { Genre, Type } from '@prisma/client';
import { useCallback, useState, type ChangeEvent, type FormEvent, type ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface Props {
    application: SerializableParticipant;
    genres: Array<Genre>;
    allGenres: Array<Genre>;
}

const typeOptions: Array<Type> = [
    'Concert',
    'DiskJockey',
    'Workshop',
    'Reading',
    'Performance',
    'FamilyProgram',
    'Exhibition',
    'Food',
    'Neighbor',
    'Misc',
    'InfoBooth',
    'Catering',
];
const typeLabels: Record<Type, string> = {
    Concert: 'Musik',
    DiskJockey: 'DJs',
    Workshop: 'Workshops',
    Reading: 'Lesungen, Vorträge & Poesie',
    Performance: 'Performance, Theater & Kabarett',
    FamilyProgram: 'Familienprogramm',
    Exhibition: 'Ausstellungen',
    Food: 'Essensstand',
    Neighbor: 'Nachbarschaft',
    Misc: 'Sonstiges',
    InfoBooth: 'Infostände',
    Catering: 'Catering',
};

interface FormValues {
    genreValues: Array<number | string>;
}

const ApplicationTypeGenreEditor = ({ application, genres, allGenres }: Props): ReactElement => {
    const [editing, setEditing] = useState(false);
    const [type, setType] = useState<Type>(application.type);
    const [error, setError] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const availableGenres = allGenres.filter(({ type: genreType }) => genreType === type);
    const methods = useForm<FormValues>({ defaultValues: { genreValues: genres.map(({ id }) => id) } });
    const { getValues, setValue } = methods;
    const toggleEditing = useCallback(() => {
        setType(application.type);
        setValue(
            'genreValues',
            genres.map(({ id }) => id),
        );
        setError(undefined);
        setEditing((value) => !value);
    }, [application.type, genres, setValue]);
    const submit = useCallback(
        async (values: FormValues) => {
            setIsSubmitting(true);
            const genreIds = values.genreValues.filter((value): value is number => typeof value === 'number');
            const newGenres = values.genreValues.filter((value): value is string => typeof value === 'string');
            try {
                await updateApplicationTypeAndGenres(application.id, {
                    type,
                    genreIds: type === 'Concert' || type === 'DiskJockey' ? genreIds : [],
                    newGenres,
                });
            } catch {
                setError('Fehler beim Submit!');
                setIsSubmitting(false);
                return;
            }
            setIsSubmitting(false);
            setEditing(false);
        },
        [application.id, type],
    );
    const handleTypeChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setType(event.target.value as Type);
            setValue('genreValues', []);
        },
        [setValue],
    );
    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void submit(getValues());
        },
        [getValues, submit],
    );

    if (!editing) {
        return <ApplicationDetailsEditButton onClick={toggleEditing} />;
    }

    return (
        <FormProvider {...methods}>
            <form className="order-last w-full basis-full space-y-2 rounded border border-black bg-white p-2" onSubmit={handleSubmit}>
                <label className="block text-sm">
                    Typ
                    <select className="mt-1 w-full rounded border border-black p-2" value={type} onChange={handleTypeChange}>
                        {typeOptions.map((option) => (
                            <option key={option} value={option}>
                                {typeLabels[option]}
                            </option>
                        ))}
                    </select>
                </label>
                {(type === 'Concert' || type === 'DiskJockey') && (
                    <MultiSelectInput
                        name="genreValues"
                        label="Genres"
                        options={availableGenres.map(({ id, name }) => ({ id, label: name }))}
                        defaultOptions={genres.map(({ id, name }) => ({ id, label: name }))}
                    />
                )}
                <ApplicationDetailsFormControls errorMessage={error} isSubmitting={isSubmitting} onCancel={toggleEditing} />
            </form>
        </FormProvider>
    );
};

export default ApplicationTypeGenreEditor;
