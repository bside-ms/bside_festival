'use client';

import TextInput from '@/components/form/TextInput';
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
    scheduleEntryId: number;
}

const AttendeeForm = ({ scheduleEntryId }: Props): ReactElement => {
    const [hasSuccessfullyAttended, setHasSuccessfullyAttended] = useState(false);

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

                    if (result.errorCode === 1721561870452) {
                        setError('root', { message: 'Leider sind keine freien Plätze mehr verfügbar.' });
                        return;
                    }

                    setError('root', { message: 'Die Anmeldung ist für diesen Programmpunkt nicht verfügbar.' });
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

    const handleBackClick = useCallback(() => setHasSuccessfullyAttended(false), []);

    return (
        <div>
            <div className="font-display text-xl font-black">Anmeldung</div>

            {hasSuccessfullyAttended ? (
                <div className="mt-3 bg-[#F2C48D] p-4 text-[#2C2E83]">
                    <div>
                        Du hast dich erfolgreich für die Veranstaltung angemeldet. In einer E-Mail schicken wir dir nochmal alle Details zu!
                    </div>

                    <div>
                        <button type="button" className="mt-3 font-bold underline" onClick={handleBackClick}>
                            zurück
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-3">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-[350px] flex-col gap-4">
                            <TextInput<AttendeeFormValues> name="fullName" label="Vor- und Nachname" required={true} />

                            <TextInput<AttendeeFormValues> name="mailAddress" label="E-Mail" required={true} validate={validateEmail} />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#2C2E83] p-3 font-display text-sm font-black text-white disabled:bg-[#2C2E83]/60"
                            >
                                Teilnehmen
                            </button>

                            {errors.root && <div className="text-red-600">{errors.root.message}</div>}
                        </form>
                    </FormProvider>
                </div>
            )}
        </div>
    );
};

export default AttendeeForm;
