import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DeleteVenueRequest, SuccessfulDeleteVenueResponse } from 'app/api/applications/venue/delete/route';
import { SuccessfulUpdateVenueResponse, UpsertVenueRequest } from 'app/api/applications/venue/update/route';
import Checkbox from 'components/form/Checkbox';
import SelectInput from 'components/form/SelectInput';
import { useParticipantsOverviewContext, useParticipantVenues } from 'components/participants/overview/ParticipantsOverviewContext';
import { addDays, differenceInDays, isSameDay } from 'date-fns';
import formatDate from 'lib/common/helper/formatDate';
import { ReactElement, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type VenueFormValues = { locationId: number } & Record<string, boolean>;

interface Props {
    participantId: number;
}

const getDateOptions = (venuesDateRange: [Date, Date] | null): Array<Date> => {
    if (venuesDateRange === null) {
        return [];
    }

    const [startDate, endDate] = venuesDateRange;

    const options = new Array<Date>();
    let nextDate = startDate;

    do {
        options.push(nextDate);
        nextDate = addDays(nextDate, 1);
    } while (differenceInDays(nextDate, endDate) <= 0);

    return options;
};

const VenueForm = ({ participantId }: Props): ReactElement => {
    const participantVenues = useParticipantVenues(participantId);

    const { updateAllVenues, allLocations, venuesDateRange } = useParticipantsOverviewContext();

    const methods = useForm<VenueFormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
        resetField,
    } = methods;

    const handleFormSubmit = useCallback(
        async ({ locationId, ...dateValues }: VenueFormValues) => {
            clearErrors('root');

            const dates = Object.entries(dateValues)
                .filter(([date, isActive]) => /\d{4}-\d{2}-\d{2}/.test(date) && isActive)
                .map(([date]) => date);

            const request: UpsertVenueRequest = {
                participantId,
                locationId: Number(locationId),
                dates,
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

                        <div className="space-y-2">
                            {getDateOptions(venuesDateRange).map((date) => {
                                const name = formatDate(date, 'yyyy-MM-dd');

                                return (
                                    <Checkbox
                                        key={name}
                                        name={name}
                                        label={formatDate(date, 'EEEE, dd.MM.')}
                                        initiallyChecked={participantVenues[0]?.dates.some((venueDate) => isSameDay(date, venueDate))}
                                    />
                                );
                            })}
                        </div>

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

            {participantVenues.length > 0 && (
                <div className="mt-4 max-w-[350px]">
                    <a onClick={handleVenueDelete} className="cursor-pointer text-sky-500 hover:text-sky-600">
                        Ort löschen
                    </a>
                </div>
            )}
        </div>
    );
};

export default VenueForm;
