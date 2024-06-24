import { useCallback, useState } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import TextArea from 'components/form/TextArea';
import type { SuccessfulUpdateDescriptionResponse, UpdateDescriptionRequest } from 'pages/api/applications/update/description';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface DescriptionFormValues {
    description: string;
}

interface Props {
    application: SerializableParticipant;
}

const ApplicationDescriptionForm = ({ application }: Props): ReactElement => {
    const { updateApplication } = useApplicationsOverviewContext();

    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<DescriptionFormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
    } = methods;

    const handleFormSubmit = useCallback(
        async ({ description }: DescriptionFormValues) => {
            clearErrors('root');

            const request: UpdateDescriptionRequest = {
                id: application.id,
                description,
            };

            const response = await fetch('/api/applications/update/description', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                setError('root', { message: 'Fehler beim Submit!' });
            } else {
                const { updatedParticipant } = (await response.json()) as SuccessfulUpdateDescriptionResponse;

                updateApplication(updatedParticipant);

                toggleShowForm();
            }
        },
        [application.id, clearErrors, setError, toggleShowForm, updateApplication],
    );

    if (!showForm) {
        return (
            <div className="mt-4">
                <div>{application.updatedDescription ?? application.description}</div>
                <a onClick={toggleShowForm} className="cursor-pointer text-sky-700">
                    Beschreibung bearbeiten…
                </a>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-3xl flex-col gap-4">
                    <TextArea<DescriptionFormValues>
                        name="description"
                        label="Beschreibung"
                        defaultValue={application.updatedDescription ?? application.description ?? ''}
                        rows={10}
                    />

                    <div className="text-sm text-gray-800">
                        <div className="font-bold text-gray-900">Ursprüngliche Beschreibung</div>
                        <div>{application.description}</div>
                    </div>

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
                        <a onClick={toggleShowForm} className="cursor-pointer text-sky-700">
                            abbrechen
                        </a>
                    </div>

                    {isSubmitting && (
                        <div className="text-black">
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

export default ApplicationDescriptionForm;
