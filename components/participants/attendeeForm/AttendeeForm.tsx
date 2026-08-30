'use client';

import Checkbox from '@/components/form/Checkbox';
import TextArea from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { registerWorkshopAttendee } from '@/lib/actions/workshopAttendeeActions';
import {
    workshopAttendeeMessageMaxLength,
    workshopAttendeeRegistrationSchema,
    type WorkshopAttendeeRegistrationValues,
} from '@/lib/schemas/workshopAttendeeSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface Props {
    scheduleEntryId: number;
    maxAttendees: number;
    availableAttendees: number;
}

const AttendeeForm = ({ scheduleEntryId, maxAttendees, availableAttendees }: Props): ReactElement => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isReserved, setIsReserved] = useState(false);
    const methods = useForm<WorkshopAttendeeRegistrationValues>({
        resolver: zodResolver(workshopAttendeeRegistrationSchema),
        defaultValues: { acceptDataProcessing: false, fullName: '', mailAddress: '', message: '', scheduleEntryId },
    });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: WorkshopAttendeeRegistrationValues) => {
            clearErrors('root');

            try {
                const result = await registerWorkshopAttendee({ ...values, scheduleEntryId });

                if (result.status === 'reserved') {
                    setIsReserved(true);
                    reset();
                    return;
                }

                const message =
                    result.status === 'duplicate'
                        ? 'Für diesen Termin gibt es bereits eine Anmeldung mit diesem Namen und dieser E-Mail-Adresse.'
                        : result.status === 'full'
                          ? 'Leider sind keine freien Plätze mehr verfügbar.'
                          : 'Die Anmeldung ist für diesen Workshop leider nicht verfügbar.';
                setError('root', { message });
            } catch {
                setError('root', { message: 'Fehler beim Absenden. Bitte versuch es noch einmal.' });
            }
        },
        [clearErrors, reset, scheduleEntryId, setError],
    );

    const toggleForm = useCallback(() => setIsFormOpen((isOpen) => !isOpen), []);

    if (isReserved) {
        return (
            <div className="mt-5 bg-[#F2C48D] p-4 font-medium">
                Wir haben einen Platz für dich reserviert. Bitte bestätige deine Teilnahme innerhalb von 24 Stunden über den Link in deiner
                E-Mail.
            </div>
        );
    }

    return (
        <div className="mt-5">
            <div className="font-display text-xl font-black">Anmeldung</div>
            <p className="mt-2 font-medium">
                Maximal {maxAttendees} Personen · noch {availableAttendees} {availableAttendees === 1 ? 'Platz' : 'Plätze'} frei
            </p>

            {availableAttendees === 0 ? (
                <div className="mt-3 bg-[#F2C48D] p-4 font-medium">Dieser Workshop ist leider ausgebucht.</div>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={toggleForm}
                        aria-expanded={isFormOpen}
                        className="mt-4 bg-[#2C2E83] px-5 py-3 font-display text-sm font-black text-white"
                    >
                        {isFormOpen ? 'Anmeldung schließen' : 'Für diesen Workshop anmelden'}
                    </button>
                    {isFormOpen && (
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="mt-4 flex max-w-lg flex-col gap-4">
                                <TextInput<WorkshopAttendeeRegistrationValues>
                                    name="fullName"
                                    label="Vor- und Nachname"
                                    info="Vor- und Nachname"
                                    required={true}
                                />
                                <TextInput<WorkshopAttendeeRegistrationValues>
                                    name="mailAddress"
                                    label="E-Mail-Adresse"
                                    info="E-Mail-Adresse"
                                    required={true}
                                    type="email"
                                />
                                <TextArea<WorkshopAttendeeRegistrationValues>
                                    name="message"
                                    label="Nachricht an die Workshopgebenden"
                                    info="Nachricht an die Workshopgebenden"
                                    maxLength={workshopAttendeeMessageMaxLength}
                                    rows={4}
                                />
                                <div className="flex flex-col gap-2">
                                    <Checkbox<WorkshopAttendeeRegistrationValues>
                                        name="acceptDataProcessing"
                                        label="Ich habe die Datenschutzerklärung gelesen und erkläre mich mit der vertraulichen Verarbeitung meiner Daten einverstanden."
                                    />
                                    <div className="pl-8 text-sm">
                                        Hier geht&apos;s zur{' '}
                                        <Link
                                            href="https://b-side.ms/kv/datenschutz/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline hover:text-red-600"
                                        >
                                            Datenschutzerklärung
                                        </Link>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#2C2E83] p-3 font-display text-sm font-black text-white disabled:bg-[#2C2E83]/60"
                                >
                                    Anmeldung abschicken
                                </button>
                                {errors.root && <div className="text-red-600">{errors.root.message}</div>}
                            </form>
                        </FormProvider>
                    )}
                </>
            )}
        </div>
    );
};

export default AttendeeForm;
