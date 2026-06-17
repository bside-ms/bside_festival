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
import type { MouseEvent, ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type DescriptionFormValues = z.infer<typeof updateApplicationDescriptionSchema>;
type NameFormValues = z.infer<typeof updateApplicationNameSchema>;

interface Props {
    application: SerializableParticipant;
    showName?: boolean;
}

export const ApplicationNameForm = ({ application: { id, name } }: Props): ReactElement => {
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

    const handleFormClick = useCallback((event: MouseEvent<HTMLFormElement>) => event.stopPropagation(), []);

    if (showForm) {
        return (
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    noValidate={true}
                    className="flex max-w-3xl flex-col gap-4"
                    onClick={handleFormClick}
                >
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

const ApplicationDescriptionForm = ({ application: { description, id } }: Props): ReactElement => {
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
                        required={true}
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
        <div className="mt-4">
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Beschreibung</ApplicationDetailsTitle>
            <div className="whitespace-pre-wrap">{description}</div>
        </div>
    );
};

const ApplicationNameAndDescriptionForm = ({ application, showName = true }: Props): ReactElement => (
    <>
        {showName && <ApplicationNameForm application={application} />}
        <ApplicationDescriptionForm application={application} />
    </>
);

export default ApplicationNameAndDescriptionForm;
