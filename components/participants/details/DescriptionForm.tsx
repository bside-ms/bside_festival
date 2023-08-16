import { useCallback, useState } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TextArea from 'components/form/TextArea';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import type { SuccessfulUpdateDescriptionResponse, UpdateDescriptionRequest } from 'pages/api/applications/update/description';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

export interface DescriptionFormValues {
    description: string;
}

interface Props {
    participant: SerializableParticipant;
}

const DescriptionForm = ({ participant }: Props): ReactElement => {

    const { status } = useSession();

    const { updateParticipant } = useParticipantsOverviewContext();

    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm(prevState => !prevState), []);

    const methods = useForm<DescriptionFormValues>();
    const { handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors } = methods;

    const handleFormSubmit = useCallback(async ({ description }: DescriptionFormValues) => {

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

            const {
                updatedParticipant,
            } = await response.json() as SuccessfulUpdateDescriptionResponse;

            updateParticipant(updatedParticipant);

            toggleShowForm();
        }

    }, [participant.id, clearErrors, setError, toggleShowForm, updateParticipant]);

    if (!showForm) {
        return (
            <div className="mt-4">
                <div>
                    {participant.updatedDescription ?? participant.description}
                </div>
                {status === 'authenticated' && (
                    <a onClick={toggleShowForm} className="text-sky-700 cursor-pointer">
                        Beschreibung bearbeiten…
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="mt-4">
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    noValidate={true}
                    className="flex gap-4 flex-col max-w-3xl"
                >
                    <TextArea<DescriptionFormValues>
                        name="description"
                        label="Beschreibung"
                        defaultValue={participant.updatedDescription ?? participant.description ?? ''}
                        rows={10}
                    />

                    <div className="text-sm text-gray-800">
                        <div className="font-bold text-gray-900">Ursprüngliche Beschreibung</div>
                        <div>
                            {participant.description}
                        </div>
                    </div>

                    <div>
                        <label className="max-w-[300px] bg-black p-1 block">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white border border-white rounded font-display text-sm leading-3 p-3 disabled:bg-gray-600"
                            >
                                Speichern
                            </button>
                        </label>
                        <a onClick={toggleShowForm} className="text-sky-700 cursor-pointer">
                            abbrechen
                        </a>
                    </div>

                    {isSubmitting && (
                        <div className="text-black">
                            <span className="mr-1">Wird gespeichert</span> <span className="animate-spin inline-block w-3"><FontAwesomeIcon icon={faSpinner} /></span>
                        </div>
                    )}

                    {errors.root && (
                        <div className="text-red-600">
                            {errors.root.message}
                        </div>
                    )}
                </form>
            </FormProvider>
        </div>
    );
};

export default DescriptionForm;
