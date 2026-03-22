import Checkbox from '@/components/form/Checkbox';
import SelectInput from '@/components/form/SelectInput';
import { useParticipantsOverviewContext, useParticipantVenues } from '@/components/participants/overview/ParticipantsOverviewContext';
import { deleteVenue, updateVenue } from '@/lib/actions/venueActions';
import formatDate from '@/lib/common/helper/formatDate';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addDays, differenceInDays, isSameDay } from 'date-fns';
import { range } from 'lodash';
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

    return range(differenceInDays(endDate, startDate) + 1).map((i) => addDays(startDate, i));
};

const VenueForm = ({ participantId }: Props): ReactElement => {
    const participantVenues = useParticipantVenues(participantId);

    const { allLocations, venuesDateRange } = useParticipantsOverviewContext();

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

            try {
                await updateVenue(participantId, Number(locationId), dates);
            } catch {
                setError('root', { message: 'Fehler beim Submit!' });
            }
        },
        [clearErrors, participantId, setError],
    );

    const handleVenueDelete = useCallback(async () => {
        try {
            await deleteVenue(participantId);
            resetField('locationId');
        } catch {
            setError('root', { message: 'Fehler beim Submit!' });
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
