import { useCallback, useState } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import DateTimeInput from 'components/form/DateTimeInput';
import SelectInput from 'components/form/SelectInput';
import TextInput from 'components/form/TextInput';
import { useParticipantSlots, useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import formatDate from 'lib/common/helper/formatDate';
import type { DeleteSlotRequest, SuccessfulDeleteSlotResponse } from 'pages/api/applications/slot/delete';
import type { SuccessfulUpdateSlotResponse, UpsertSlotRequest } from 'pages/api/applications/slot/update';

interface SlotFormValues {
    locationId: number;
    beginDate: Date;
    duration?: number;
}

interface Props {
    participantId: number;
}

const SlotForm = ({ participantId }: Props): ReactElement => {
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const toggleShowDeleteButton = useCallback(() => setShowDeleteButton((prevState) => !prevState), []);

    const { updateAllSlots, allLocations } = useParticipantsOverviewContext();

    const participantSlots = useParticipantSlots(participantId);

    const methods = useForm<SlotFormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
        resetField,
    } = methods;

    const handleFormSubmit = useCallback(
        async ({ locationId, beginDate, duration }: SlotFormValues) => {
            clearErrors('root');

            if (isNaN(Number(duration))) {
                setError('duration', { message: 'Bitte nur eine Zahl angeben' });
                return;
            }

            const request: UpsertSlotRequest = {
                participantId,
                begin: new Date(beginDate),
                locationId: Number(locationId),
                duration: Number(duration),
            };

            const response = await fetch('/api/applications/slot/update', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                setError('root', { message: 'Fehler beim Submit!' });
            } else {
                const { updatedSlots } = (await response.json()) as SuccessfulUpdateSlotResponse;

                updateAllSlots(updatedSlots);
            }
        },
        [clearErrors, participantId, setError, updateAllSlots],
    );

    const handleSlotDelete = useCallback(async () => {
        const request: DeleteSlotRequest = {
            participantId,
        };

        const response = await fetch('/api/applications/slot/delete', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            setError('root', { message: 'Fehler beim Submit!' });
        } else {
            const { updatedSlots } = (await response.json()) as SuccessfulDeleteSlotResponse;

            updateAllSlots(updatedSlots);

            resetField('beginDate');
            resetField('duration');
            resetField('locationId');
        }
    }, [participantId, resetField, setError, updateAllSlots]);

    const locationOptions = allLocations.map<{ value: string; label: string }>(({ id, name }) => ({
        value: id.toString(),
        label: name,
    }));

    if (participantSlots.length > 1) {
        return (
            <div>
                <div className="font-display">Programmslot</div>

                <div className="mt-2 font-bold italic">
                    Für diesen Programmpunkt sind {participantSlots.length} Slots vorhanden. Schick die gewünschten Änderungen kurz an
                    Carsten, damit er diese in der Datenbank vornimmt 😇
                </div>
            </div>
        );
    }

    const beginValue =
        participantSlots[0]?.slot?.begin === undefined ? undefined : formatDate(participantSlots[0].slot.begin, "yyyy-MM-dd'T'HH:mm");

    return (
        <div>
            <div className="font-display">Programmslot</div>

            <div className="mt-2">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-[350px] flex-col gap-4">
                        <DateTimeInput name="beginDate" label="Beginn" defaultValue={beginValue} required={true} />

                        <TextInput<SlotFormValues>
                            name="duration"
                            label="Dauer"
                            defaultValue={participantSlots[0]?.slot?.duration.toString()}
                            required={true}
                            info="Dauer in Minuten"
                        />

                        <SelectInput
                            name="locationId"
                            label="Location"
                            options={locationOptions}
                            required={true}
                            defaultValue={participantSlots[0]?.location.id.toString()}
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

            {participantSlots.length > 0 && (
                <div className="mt-4 max-w-[350px]">
                    <a onClick={toggleShowDeleteButton} className="cursor-pointer text-sky-700">
                        Slot löschen
                    </a>

                    {showDeleteButton && (
                        <div>
                            <label className="block max-w-[300px] bg-black p-1">
                                <button
                                    onClick={handleSlotDelete}
                                    className="w-full rounded border border-white bg-black p-3 font-display text-sm leading-3 text-white disabled:bg-gray-600"
                                >
                                    Slot unwiderruflich löschen
                                </button>
                            </label>

                            <div className="font-bold italic">
                                Achtung: Um den Programmpunkt komplett aus der Übersicht zu entfernen, muss der Status in der
                                Bewerbungsübersicht von "Bestätigt" auf einen anderen Wert geändert werden 😊
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SlotForm;
