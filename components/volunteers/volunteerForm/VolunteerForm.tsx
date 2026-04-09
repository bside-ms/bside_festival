'use client';

import Checkbox from '@/components/form/Checkbox';
import TextArea from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import VolunteerInfo from '@/components/volunteers/volunteerForm/VolunteerInfo';
import { addVolunteer } from '@/lib/actions/volunteerActions';
import volunteerDayPreferences from '@/lib/volunteers/volunteerDayPreferences';
import { type ReactElement, useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export interface VolunteerFormValues {
    fullName: string;
    mailAddress: string;
    phoneNumber: string;
    canCook: boolean;
    hasCar: boolean;
    canCarryHeavyStuff: boolean;
    isSocial: boolean;
    canSupportTechnician: boolean;
    canSupportArtist: boolean;
    hasMultipleTalents: boolean;
    canWorkWithChildren: boolean;
    isAvailableOnFriday: boolean;
    isAvailableOnSaturday: boolean;
    isAvailableOnSunday: boolean;
    isAvailableBefore: boolean;
    additionalInfo: string;
}

const VolunteerForm = (): ReactElement => {
    const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] = useState(false);

    const methods = useForm<VolunteerFormValues>();
    const {
        handleSubmit,
        setError,
        formState: { isSubmitting },
        clearErrors,
        reset,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: VolunteerFormValues) => {
            clearErrors('root');

            try {
                await addVolunteer({
                    fullName: values.fullName,
                    mailAddress: values.mailAddress,
                    phoneNumber: values.phoneNumber,
                    canCook: values.canCook,
                    hasCar: values.hasCar,
                    canCarryHeavyStuff: values.canCarryHeavyStuff,
                    isSocial: values.isSocial,
                    canSupportTechnician: values.canSupportTechnician,
                    canSupportArtist: values.canSupportArtist,
                    hasMultipleTalents: values.hasMultipleTalents,
                    canWorkWithChildren: false, // No entertainment for children this year
                    isAvailableOnFriday: values.isAvailableOnFriday,
                    isAvailableOnSaturday: values.isAvailableOnSaturday,
                    isAvailableOnSunday: values.isAvailableOnSunday,
                    isAvailableBefore: values.isAvailableBefore,
                    additionalInfo: values.additionalInfo,
                });
                setWasSuccessfullySubmitted(true);
                reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch {
                setError('root', { message: 'Fehler beim Submit' });
            }
        },
        [clearErrors, reset, setError],
    );

    if (wasSuccessfullySubmitted) {
        return (
            <div className="p-2">
                <div className="mb-3">
                    <VolunteerInfo />
                </div>

                <div className="mt-9 rounded-xl border-green-700 bg-gray-200 p-5 font-bold text-green-700">
                    Vielen Dank für deine Unterstützung! Wir werden uns schon bald bei dir melden!
                </div>
            </div>
        );
    }

    return (
        <div className="p-2">
            <div className="mb-3 font-display">
                <VolunteerInfo />
            </div>

            <FormProvider {...methods}>
                <div className="w-full">
                    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex flex-col gap-6">
                        <TextInput<VolunteerFormValues> name="fullName" label="Vor- und Nachname" required={true} />

                        <TextInput<VolunteerFormValues> name="phoneNumber" label="Telefonnummer" required={true} />

                        <TextInput<VolunteerFormValues> name="mailAddress" label="E-Mail-Adresse" required={true} />

                        <div className="flex flex-col gap-3 font-display">
                            An welchen Tagen kannst du uns unterstützen?
                            {volunteerDayPreferences.map(({ key, label }) => (
                                <Checkbox<VolunteerFormValues> key={key} name={key} label={label} />
                            ))}
                        </div>

                        <div>
                            <TextArea<VolunteerFormValues> name="additionalInfo" label="Möchtest du uns noch etwas über dich mitteilen?" />
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
                    </form>
                </div>
            </FormProvider>
        </div>
    );
};

export default VolunteerForm;
