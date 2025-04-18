import { useCallback, useState } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TextArea from 'components/form/TextArea';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import { SuccessfulUpdateDescriptionResponse, UpdateDescriptionRequest } from 'app/api/applications/update/description/route';

interface DescriptionFormValues {
    description: string;
}

interface Props {
    participant: SerializableParticipant;
    isLoggedIn: boolean;
}

const ParticipantDescriptionForm = ({ participant, isLoggedIn }: Props): ReactElement => {
    const { updateParticipant } = useParticipantsOverviewContext();

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
                id: participant.id,
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

                updateParticipant(updatedParticipant);

                toggleShowForm();
            }
        },
        [participant.id, clearErrors, setError, toggleShowForm, updateParticipant],
    );

    if (!showForm) {
        return (
            <div className="mt-4">
                <pre className="whitespace-pre-wrap font-display">{participant.updatedDescription ?? participant.description}</pre>

                {isLoggedIn && (
                    <a onClick={toggleShowForm} className="cursor-pointer text-sky-500 hover:text-sky-600">
                        Beschreibung bearbeiten…
                    </a>
                )}
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
                        defaultValue={participant.updatedDescription ?? participant.description ?? ''}
                        rows={10}
                    />

                    {isNotEmptyString(participant.description) && (
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

export default ParticipantDescriptionForm;
