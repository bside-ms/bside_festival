import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { SuccessfulUpdateDetailsResponse, UpdateDetailsRequest } from 'app/api/applications/update/details/route';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import TextArea from 'components/form/TextArea';
import TextInput from 'components/form/TextInput';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface NameAndDescriptionFormValues {
    name: string;
    description: string;
}

interface Props {
    application: SerializableParticipant;
}

const ApplicationNameAndDescriptionForm = ({ application }: Props): ReactElement => {
    const { updateApplication } = useApplicationsOverviewContext();

    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<NameAndDescriptionFormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
    } = methods;

    const handleFormSubmit = useCallback(
        async ({ name, description }: NameAndDescriptionFormValues) => {
            clearErrors('root');

            const request: UpdateDetailsRequest = {
                id: application.id,
                name,
                description,
            };

            const response = await fetch('/api/applications/update/details', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                setError('root', { message: 'Fehler beim Submit!' });
            } else {
                const { updatedParticipant } = (await response.json()) as SuccessfulUpdateDetailsResponse;

                updateApplication(updatedParticipant);

                toggleShowForm();
            }
        },
        [application.id, clearErrors, setError, toggleShowForm, updateApplication],
    );

    if (!showForm) {
        return (
            <>
                <div className="font-display text-2xl text-gray-100">{application.updatedName ?? application.name}</div>

                <div className="mt-4 text-gray-100">
                    <div className="whitespace-pre-wrap">{application.updatedDescription ?? application.description}</div>
                    <a onClick={toggleShowForm} className="cursor-pointer text-sky-500 hover:text-sky-600">
                        Name und Beschreibung bearbeiten…
                    </a>
                </div>
            </>
        );
    }

    return (
        <div className="mt-4">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-3xl flex-col gap-4">
                    <TextInput<NameAndDescriptionFormValues>
                        name="name"
                        label="Name"
                        required={true}
                        defaultValue={application.updatedName ?? application.name}
                    />

                    {application.updatedName !== application.name && (
                        <div className="text-sm text-gray-100">
                            <div className="font-bold text-gray-400">Ursprünglicher Name</div>
                            <div className="whitespace-pre-wrap">{application.name}</div>
                        </div>
                    )}

                    <TextArea<NameAndDescriptionFormValues>
                        name="description"
                        label="Beschreibung"
                        defaultValue={application.updatedDescription ?? application.description ?? ''}
                        rows={10}
                    />

                    {application.updatedDescription !== application.description && (
                        <div className="text-sm text-gray-100">
                            <div className="font-bold text-gray-400">Ursprüngliche Beschreibung</div>
                            <div className="whitespace-pre-wrap">{application.description}</div>
                        </div>
                    )}

                    <div>
                        <label className="block max-w-[300px] bg-black p-1">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded border border-white bg-black p-3 font-display text-sm leading-3 text-white disabled:bg-gray-600"
                            >
                                Speichern
                            </button>
                        </label>
                        <a onClick={toggleShowForm} className="cursor-pointer text-sky-500 hover:text-sky-600">
                            abbrechen
                        </a>
                    </div>

                    {isSubmitting && (
                        <div className="text-gray-100">
                            <span className="mr-1">Wird gespeichert</span>{' '}
                            <span className="inline-block w-3 animate-spin">
                                <FontAwesomeIcon icon={faSpinner} />
                            </span>
                        </div>
                    )}

                    {errors.root && <div className="text-red-600">{errors.root.message}</div>}
                </form>
            </FormProvider>
        </div>
    );
};

export default ApplicationNameAndDescriptionForm;
