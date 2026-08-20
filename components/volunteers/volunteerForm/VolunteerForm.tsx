'use client';

import Checkbox from '@/components/form/Checkbox';
import TextArea from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import VolunteerInfo from '@/components/volunteers/volunteerForm/VolunteerInfo';
import VolunteerSuccess from '@/components/volunteers/volunteerForm/VolunteerSuccess';
import { addVolunteer } from '@/lib/actions/volunteerActions';
import { volunteerAdditionalInfoMaxLength, volunteerSignupSchema, type VolunteerSignupValues } from '@/lib/schemas/volunteerSchema';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const VolunteerForm = (): ReactElement => {
    const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] = useState(false);

    const methods = useForm<VolunteerSignupValues>({
        resolver: zodResolver(volunteerSignupSchema),
        defaultValues: {
            fullName: '',
            mailAddress: '',
            phoneNumber: '',
            additionalInfo: '',
            acceptDataProcessing: false,
        },
    });
    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
        reset,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: VolunteerSignupValues) => {
            clearErrors('root');

            try {
                await addVolunteer(values);
                setWasSuccessfullySubmitted(true);
                reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch {
                setError('root', { message: 'Fehler beim Absenden. Bitte versuch es noch einmal.' });
            }
        },
        [clearErrors, reset, setError],
    );

    if (wasSuccessfullySubmitted) {
        return <VolunteerSuccess />;
    }

    return (
        <div className="flex flex-col gap-8">
            <VolunteerInfo />

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex flex-col gap-5">
                    <div className="rounded-2xl border border-black bg-white p-5 md:p-8">
                        <div className="flex flex-col gap-5">
                            <TextInput<VolunteerSignupValues>
                                name="fullName"
                                label="Vor- und Nachname"
                                info="Vor- und Nachname"
                                placeholder="z. B. Alex Müller"
                                required={true}
                            />

                            <TextInput<VolunteerSignupValues>
                                name="phoneNumber"
                                label="Telefonnummer"
                                info="Telefonnummer"
                                placeholder="z. B. 0176 12345678"
                                type="tel"
                                required={true}
                            />

                            <TextInput<VolunteerSignupValues>
                                name="mailAddress"
                                label="E-Mail-Adresse"
                                info="E-Mail-Adresse"
                                placeholder="z. B. alex@mail.de"
                                type="email"
                                required={true}
                            />

                            <TextArea<VolunteerSignupValues>
                                name="additionalInfo"
                                label="Möchtest du uns noch etwas mitteilen?"
                                info="Möchtest du uns noch etwas mitteilen?"
                                description={
                                    <p className="px-1 pb-2 text-sm leading-relaxed">
                                        Zum Beispiel wann du Zeit hast oder ob ein Auto da ist. Das Feld kannst du auch leer lassen.
                                    </p>
                                }
                                maxLength={volunteerAdditionalInfoMaxLength}
                                rows={4}
                            />

                            <div className="flex flex-col gap-2">
                                <Checkbox<VolunteerSignupValues>
                                    name="acceptDataProcessing"
                                    label="Ich habe die Datenschutzerklärung gelesen und erkläre mich mit der vertraulichen Verarbeitung meiner Daten einverstanden."
                                />
                                <div className="pl-8 text-sm">
                                    Hier geht's zur{' '}
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

                            <label className="block w-full bg-black p-1">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded border border-white bg-black p-3 font-display text-sm leading-3 text-white disabled:bg-gray-600"
                                >
                                    Absenden
                                </button>
                            </label>

                            {isSubmitting && (
                                <div>
                                    Wird gesendet{' '}
                                    <span className="ml-1 inline-block animate-spin">
                                        <FontAwesomeIcon className="w-3" icon={faSpinner} />
                                    </span>
                                </div>
                            )}

                            {errors.root && <div className="text-red-600">{errors.root.message}</div>}
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default VolunteerForm;
