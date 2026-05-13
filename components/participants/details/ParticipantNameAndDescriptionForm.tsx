import ApplicationDetailsEditButton from '@/components/applications/applicationDetails/ApplicationDetailsEditButton';
import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import TextArea from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { updateApplicationDescription, updateApplicationName } from '@/lib/actions/applicationActions';
import {
    applicationDescriptionMaxLength,
    updateApplicationDescriptionSchema,
    updateApplicationNameSchema,
} from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type DescriptionFormValues = z.infer<typeof updateApplicationDescriptionSchema>;
type NameFormValues = z.infer<typeof updateApplicationNameSchema>;

interface Props {
    participant: SerializableParticipant;
    isLoggedIn: boolean;
}

const ParticipantNameForm = ({ participant: { id, name } }: { participant: SerializableParticipant }): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<NameFormValues>({ resolver: zodResolver(updateApplicationNameSchema) });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: NameFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationName(id, values);
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
                    <TextInput<NameFormValues> name="name" label="Name" info="Name" required={true} defaultValue={name} />

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
        <div className="font-display text-2xl">
            {name}
            <ApplicationDetailsEditButton onClick={toggleShowForm} />
        </div>
    );
};

const ParticipantDescriptionForm = ({ participant: { description, id }, isLoggedIn }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<DescriptionFormValues>({ resolver: zodResolver(updateApplicationDescriptionSchema) });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: DescriptionFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationDescription(id, values);
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
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="mt-4 flex max-w-3xl flex-col gap-4">
                    <TextArea<DescriptionFormValues>
                        name="description"
                        label="Beschreibung"
                        info="Beschreibung"
                        defaultValue={description ?? ''}
                        maxLength={applicationDescriptionMaxLength}
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
            {isLoggedIn && <ApplicationDetailsTitle onEditClick={toggleShowForm}>Beschreibung</ApplicationDetailsTitle>}
            <pre className="mt-4 font-display text-sm leading-5 whitespace-pre-wrap md:text-base md:leading-6">{description}</pre>
        </div>
    );
};

const ParticipantNameAndDescriptionForm = ({ isLoggedIn, participant }: Props): ReactElement => (
    <>
        {isLoggedIn && <ParticipantNameForm participant={participant} />}
        <ParticipantDescriptionForm isLoggedIn={isLoggedIn} participant={participant} />
    </>
);

export default ParticipantNameAndDescriptionForm;
