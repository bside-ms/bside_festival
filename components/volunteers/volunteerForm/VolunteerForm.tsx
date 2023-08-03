import { type ReactElement, useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Checkbox from 'components/form/Checkbox';
import TextInput from 'components/form/TextInput';
import VolunteerInfo from 'components/volunteers/volunteerForm/VolunteerInfo';
import volunteerDayPreferences from 'lib/volunteers/volunteerDayPreferences';
import volunteerPreferences from 'lib/volunteers/volunteerPreferences';
import type { AddVolunteerRequest } from 'pages/api/volunteers/add';

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
}

const VolunteerForm = (): ReactElement => {

    const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] = useState(false);

    const methods = useForm<VolunteerFormValues>();
    const { handleSubmit, setError, formState: { isSubmitting }, clearErrors, reset } = methods;

    const handleFormSubmit = useCallback(async (values: VolunteerFormValues) => {

        clearErrors('root');

        const request: AddVolunteerRequest = {
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
        };

        const response = await fetch('/api/volunteers/add', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            setError('root', { message: 'Fehler beim Submit' });
        } else {
            setWasSuccessfullySubmitted(true);
            reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    }, [clearErrors, reset, setError]);

    const title = (
        <div className="text-black font-display mb-4">
            <div className="text-2xl">B-Side Festival 2023</div>
            <div className="text-4xl font-bold">Mithelfen</div>
        </div>
    );

    if (wasSuccessfullySubmitted) {
        return (
            <div className="p-2 rounded-md">
                {title}

                <div className="mb-3">
                    <VolunteerInfo />
                </div>

                <div className="mt-9 bg-gray-200 border-green-700 text-green-700 p-5 rounded-xl font-bold">
                    Vielen Dank für deine Unterstützung! Wir werden uns schon bald bei dir melden!
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 rounded-md">
            {title}

            <div className="mb-3">
                <VolunteerInfo />
            </div>

            <FormProvider {...methods}>
                <div className="w-full">
                    <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        noValidate={true}
                        className="flex gap-6 flex-col"
                    >
                        <TextInput<VolunteerFormValues>
                            name="fullName"
                            label="Vor- und Nachname"
                            required={true}
                        />

                        <TextInput<VolunteerFormValues>
                            name="phoneNumber"
                            label="Telefonnummer"
                            required={true}
                        />

                        <TextInput<VolunteerFormValues>
                            name="mailAddress"
                            label="E-Mail-Adresse"
                            required={true}
                        />

                        <div className="flex flex-col gap-3">
                            {volunteerPreferences.map(({ key, label }) => (
                                <Checkbox<VolunteerFormValues>
                                    key={key}
                                    name={key}
                                    label={label}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            {volunteerDayPreferences.map(({ key, label }) => (
                                <Checkbox<VolunteerFormValues>
                                    key={key}
                                    name={key}
                                    label={label}
                                />
                            ))}
                        </div>

                        <label className="w-full bg-black p-1 block">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white border border-white rounded font-display text-sm leading-3 p-3 disabled:bg-gray-600"
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
