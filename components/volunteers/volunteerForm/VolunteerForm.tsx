// import { Type } from '@prisma/client'
import { type ReactElement, useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ContentWrapper from 'components/common/ContentWrapper';
import Checkbox from 'components/form/Checkbox';
import TextInput from 'components/form/TextInput';
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
            canWorkWithChildren: values.canWorkWithChildren,
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

    if (wasSuccessfullySubmitted) {
        return (
            <ContentWrapper>
                <div className="p-2 rounded-md">
                    <div className="text-2xl mb-3">
                        Mithelfen
                    </div>

                    <div className="mb-3">
                        <div>
                            Schon sehr bald geht es im Hansaviertel rund! Für unser B-Side Festival 2023
                            „Interaktion Reaktion“ brauchen wir euch! Wir suchen tatkräftige Helfer*innen. Dabei gibt
                            es verschiedene Aufgaben, bei denen ihr euch einbringen könnt: Die Betreuung von  Konzerten,
                            Workshops, Ausstellungen und Lesungen, die Verpflegung für das Helfer*innen- und B-Side-Team,
                            Hilfe beim Auf- und Abbau und der Technik des Festivals, Unterstützung des Awareness-Teams
                            auf dem gesamten Festival und beim Spendensammeln.
                        </div>
                        <div>
                            Mit allen Stärken und Interessen seid ihr herzlich willkommen uns zu unterstützen! Denn nur
                            mit euch kann das Festival so toll wie die letzten Jahre werden!
                        </div>
                        <div>
                            Um einen Überblick über eure Stärken und Interessen zu bekommen,
                            haben wir folgenden Fragebogen vorbereitet. Kreuzt bitte an,
                            was auf euch zutrifft. Außerdem hinterlasst bitte eure Kontaktdaten,
                            sodass wir euch erreichen können. Danke!
                        </div>
                    </div>

                    <div className="mt-9 bg-gray-200 border-green-700 text-green-700 p-5 rounded-xl font-bold">
                        Vielen Dank für deine Unterstützung! Wir werden uns schon bald bei dir melden!
                    </div>
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper>
            <div className="p-2 rounded-md">
                <div className="text-2xl mb-3">
                    Mithelfen
                </div>

                <div className="mb-3">
                    <div>
                        Schon sehr bald geht es im Hansaviertel rund! Für unser B-Side Festival 2023
                        „Interaktion Reaktion“ brauchen wir euch! Wir suchen tatkräftige Helfer*innen. Dabei gibt
                        es verschiedene Aufgaben, bei denen ihr euch einbringen könnt: Die Betreuung von  Konzerten,
                        Workshops, Ausstellungen und Lesungen, die Verpflegung für das Helfer*innen- und B-Side-Team,
                        Hilfe beim Auf- und Abbau und der Technik des Festivals, Unterstützung des Awareness-Teams
                        auf dem gesamten Festival und beim Spendensammeln.
                    </div>
                    <div>
                        Mit allen Stärken und Interessen seid ihr herzlich willkommen uns zu unterstützen! Denn nur
                        mit euch kann das Festival so toll wie die letzten Jahre werden!
                    </div>
                    <div>
                        Um einen Überblick über eure Stärken und Interessen zu bekommen,
                        haben wir folgenden Fragebogen vorbereitet. Kreuzt bitte an,
                        was auf euch zutrifft. Außerdem hinterlasst bitte eure Kontaktdaten,
                        sodass wir euch erreichen können. Danke!
                    </div>
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
        </ContentWrapper>
    );
};

export default VolunteerForm;
