import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessfulUpdateDetailsResponse, UpdateDetailsRequest } from 'app/api/applications/update/details/route';
import TextArea from 'components/form/TextArea';
import TextInput from 'components/form/TextInput';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface DescriptionFormValues {
    name: string;
    description: string;
}

interface Props {
    participant: SerializableParticipant;
    isLoggedIn: boolean;
    showForm: boolean;
    toggleForm: () => void;
}

const ParticipantNameAndDescriptionForm = ({ participant, isLoggedIn, showForm, toggleForm }: Props): ReactElement => {
    const { updateParticipant } = useParticipantsOverviewContext();

    const methods = useForm<DescriptionFormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
    } = methods;

    const handleFormSubmit = useCallback(
        async ({ name, description }: DescriptionFormValues) => {
            clearErrors('root');

            const request: UpdateDetailsRequest = {
                id: participant.id,
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

                updateParticipant(updatedParticipant);

                toggleForm();
            }
        },
        [participant.id, clearErrors, setError, toggleForm, updateParticipant],
    );

    if (!showForm) {
        return (
            <div>
                <pre className="font-display whitespace-pre-wrap">{participant.updatedDescription ?? participant.description}</pre>

                {isLoggedIn && (
                    <a onClick={toggleForm} className="cursor-pointer text-sky-500 hover:text-sky-600">
                        Name und Beschreibung bearbeiten…
                    </a>
                )}
            </div>
        );
    }

    return (
        <div>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-3xl flex-col gap-4">
                    <TextInput<DescriptionFormValues>
                        name="name"
                        label="Name"
                        required={true}
                        defaultValue={participant.updatedName ?? participant.name}
                    />

                    {participant.updatedName !== participant.name && (
                        <div className="text-sm text-gray-800">
                            <div className="font-bold text-gray-900">Ursprünglicher Name</div>
                            <div>{participant.name}</div>
                        </div>
                    )}

                    <TextArea<DescriptionFormValues>
                        name="description"
                        label="Beschreibung"
                        defaultValue={participant.updatedDescription ?? participant.description ?? ''}
                        rows={10}
                    />

                    {participant.updatedDescription !== participant.description && (
                        <div className="text-sm text-gray-800">
                            <div className="font-bold text-gray-900">Ursprüngliche Beschreibung</div>
                            <div>{participant.description}</div>
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
                        <a onClick={toggleForm} className="cursor-pointer text-sky-500 hover:text-sky-600">
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

export default ParticipantNameAndDescriptionForm;
