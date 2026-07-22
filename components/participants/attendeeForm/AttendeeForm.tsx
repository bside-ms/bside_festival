import TextInput from '@/components/form/TextInput';
import { ParticipantSlot, useScheduleEntryAttendees } from '@/components/participants/overview/ParticipantsOverviewContext';
import { attendScheduleEntry } from '@/lib/actions/scheduleEntryActions';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import isValidEmail from '@/lib/common/helper/isValidEmail';
import { ReactElement, useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface AttendeeFormValues {
    fullName: string;
    mailAddress: string;
}

interface Props {
    slot: ParticipantSlot;
}

const AttendeeForm = ({
    slot: {
        scheduleEntry: { id: scheduleEntryId, maxAttendees },
    },
}: Props): ReactElement => {
    const [hasSuccessfullyAttended, setHasSuccessfullyAttended] = useState(false);

    const slotAttendees = useScheduleEntryAttendees(scheduleEntryId);

    const methods = useForm<AttendeeFormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
        reset,
    } = methods;

    const handleFormSubmit = useCallback(
        async ({ fullName, mailAddress }: AttendeeFormValues) => {
            clearErrors('root');

            try {
                const result = await attendScheduleEntry(scheduleEntryId, fullName, mailAddress);

                if (result !== null) {
                    if (result.errorCode === 1721561870451) {
                        setError('root', { message: 'Du bist bereits für die Veranstaltung angemeldet!' });
                        return;
                    }

                    setError('root', { message: 'Unbekannter Fehler beim Submit!' });
                } else {
                    setHasSuccessfullyAttended(true);
                    reset();
                }
            } catch {
                setError('root', { message: 'Technischer Fehler beim Submit!' });
            }
        },
        [clearErrors, reset, setError, scheduleEntryId],
    );

    const validateEmail = useCallback((email: string): string | undefined => {
        if (isEmptyString(email)) {
            return undefined;
        }

        if (!isValidEmail(email)) {
            return 'Bitte gib eine gültige E-Mail-Adresse ein';
        }
    }, []);

    const hasOpenSeats = slotAttendees.length < (maxAttendees ?? 0);

    const handleBackClick = useCallback(() => setHasSuccessfullyAttended(false), []);

    return (
        <div>
            <div className="font-display">Melde dich hier für den Programmpunkt an!</div>

            {hasSuccessfullyAttended ? (
                <div className="mt-2 max-w-[350px] rounded bg-white/70 p-3 text-green-800">
                    <div>
                        Du hast dich erfolgreich für die Veranstaltung angemeldet. In einer E-Mail schicken wir dir nochmal alle Details zu!
                    </div>

                    <div>
                        <span role="button" className="cursor-pointer text-blue-500 underline" onClick={handleBackClick}>
                            zurück
                        </span>
                    </div>
                </div>
            ) : (
                <div className="mt-2">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-[350px] flex-col gap-4">
                            <TextInput<AttendeeFormValues>
                                name="fullName"
                                label="Vor- und Nachname"
                                required={true}
                                isDisabled={!hasOpenSeats}
                            />

                            <TextInput<AttendeeFormValues>
                                name="mailAddress"
                                label="E-Mail"
                                required={true}
                                validate={validateEmail}
                                isDisabled={!hasOpenSeats}
                            />

                            {hasOpenSeats ? (
                                <label className="block max-w-[300px] cursor-pointer bg-black p-1">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded border border-white bg-black p-3 font-display text-sm leading-3 text-white disabled:bg-gray-600"
                                    >
                                        Teilnehmen
                                    </button>
                                </label>
                            ) : (
                                <div className="rounded bg-white/70 p-3 text-red-500">
                                    Leider sind momentan keine freien Plätze mehr für die Veranstaltung frei!
                                </div>
                            )}

                            {errors.root && <div className="text-red-600">{errors.root.message}</div>}
                        </form>
                    </FormProvider>
                </div>
            )}
        </div>
    );
};

export default AttendeeForm;
