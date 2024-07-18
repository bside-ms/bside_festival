import { ReactElement, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import SelectInput from 'components/form/SelectInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useParticipantsOverviewContext, useParticipantVenues } from 'components/participants/overview/ParticipantsOverviewContext';
import { SuccessfulUpdateVenueResponse, UpsertVenueRequest } from 'pages/api/applications/venue/update';
import { DeleteVenueRequest, SuccessfulDeleteVenueResponse } from 'pages/api/applications/venue/delete';

interface VenueFormValues {
    locationId: number;
}

interface Props {
    participantId: number;
}

const VenueForm = ({ participantId }: Props): ReactElement => {
    const participantVenues = useParticipantVenues(participantId);

    const { updateAllVenues, allLocations } = useParticipantsOverviewContext();

    const methods = useForm<VenueFormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
        resetField,
    } = methods;

    const handleFormSubmit = useCallback(
        async ({ locationId }: VenueFormValues) => {
            clearErrors('root');

            const request: UpsertVenueRequest = {
                participantId,
                locationId: Number(locationId),
            };

            const response = await fetch('/api/applications/venue/update', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                setError('root', { message: 'Fehler beim Submit!' });
            } else {
                const { updatedVenues } = (await response.json()) as SuccessfulUpdateVenueResponse;

                updateAllVenues(updatedVenues);
            }
        },
        [clearErrors, participantId, setError, updateAllVenues],
    );

    const handleVenueDelete = useCallback(async () => {
        const request: DeleteVenueRequest = { participantId };

        const response = await fetch('/api/applications/venue/delete', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            setError('root', { message: 'Fehler beim Submit!' });
        } else {
            const { updatedVenues } = (await response.json()) as SuccessfulDeleteVenueResponse;

            updateAllVenues(updatedVenues);

            resetField('locationId');
        }
    }, [participantId, resetField, setError]);

    const locationOptions = allLocations.map<{ value: string; label: string }>(({ id, name }) => ({
        value: id.toString(),
        label: name,
    }));

    return (
        <div>
            <div className="font-display">Ort</div>

            <div className="mt-2">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-[350px] flex-col gap-4">
                        <SelectInput
                            name="locationId"
                            label="Location"
                            options={locationOptions}
                            required={true}
                            defaultValue={participantVenues[0]?.location.id.toString()}
                        />

                        <label className="block max-w-[300px] bg-black p-1">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded border border-white bg-black p-3 font-display text-sm leading-3 text-white disabled:bg-gray-600"
                            >
                                Speichern
                            </button>
                        </label>

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

            {participantVenues.length > 0 && (
                <div className="mt-4 max-w-[350px]">
                    <a onClick={handleVenueDelete} className="cursor-pointer text-sky-700">
                        Ort löschen
                    </a>
                </div>
            )}
        </div>
    );
};

export default VenueForm;
