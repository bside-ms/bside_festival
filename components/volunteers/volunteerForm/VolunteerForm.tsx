// import { Type } from '@prisma/client'
import { type ReactElement, useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ContentWrapper from 'components/common/ContentWrapper';
import Checkbox from 'components/form/Checkbox';
import TextInput from 'components/form/TextInput';

export interface VolunteerFormValues {
    name: string;
    contactNumber: string;
    contactMail: string;
    canCook: boolean;
    hasCar: boolean;
    hasDrivingLicense: boolean;
    canCarryHeavyStuff: boolean;
    canLiftHeavyStuff: boolean;
    isSocial: boolean;
    canSupportTechnician: boolean;
    canSupportArtist: boolean;
    hasMultipleTalents: boolean;
    canWorkWithChildren: boolean;
    canCleanupAfterShow: boolean;
    isAvailableOnFriday: boolean;
    isAvailableOnSaturday: boolean;
}

const VolunteerForm = (): ReactElement => {
    
    const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] = useState(false);

    const methods = useForm<VolunteerFormValues>();
    const { handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors, reset } = methods;
    
    const handleFormReset = useCallback(() => reset(), [reset]);
    
    const handleFormSubmit = useCallback(async (values: VolunteerFormValues) => {

        clearErrors('root');
        
        const request = {    
            name: values.name,
            contactMail: values.contactMail,
            contactNumber: values.contactNumber,
            canCook: values.canCook,
            hasCar: values.hasCar,
            hasDrivingLicense: values.hasDrivingLicense,
            canCarryHeavyStuff: values.canCarryHeavyStuff,
            canLiftHeavyStuff: values.canLiftHeavyStuff,
            isSocial: values.isSocial,
            canSupportTechnician: values.canSupportTechnician,
            canSupportArtist: values.canSupportArtist,
            hasMultipleTalents: values.hasMultipleTalents,
            canWorkWithChildren: values.canWorkWithChildren,
            canCleanupAfterShow: values.canCleanupAfterShow,
            isAvailableOnFriday: values.isAvailableOnFriday,
            isAvailableOnSaturday: values.isAvailableOnSaturday,

        };
        
        console.log(request);

        // const response = await fetch('/api/volunteers/add', {
        //     method: 'POST', 
        //     headers: { 'Content-type': 'volunteer/json' }, 
        //     body: JSON.stringify(request),
        // });

        // if (!response.ok) {
        //     setError('root', { message: 'Fehler beim Submit' });
            
        // }

        // setWasSuccessfullySubmitted(true);
        // handleFormReset();
        
    }, [clearErrors, handleFormReset, setError]);

    return (
        <>
            <div className="bg-blue">
                <ContentWrapper>
                    <div className="text-2xl">
                        Mithelfen
                    </div>
                </ContentWrapper>
            </div>

            <div className="bg-blue">
                <ContentWrapper>
                    <div>
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
                
                </ContentWrapper>
            </div>
            <FormProvider {...methods}>
                <div className="w-full">
                    <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        noValidate={true}
                        className="flex gap-6 flex-col"
                    >
                        <TextInput<VolunteerFormValues>
                            name="name"
                            label="Vor- und Nachname"
                            required={true}
                        />

                        <TextInput<VolunteerFormValues>
                            name="contactNumber"
                            label="Telefonnummer"
                            required={true}
                        />

                        <TextInput<VolunteerFormValues>
                            name="contactMail"
                            label="E-Mail-Adresse"
                            required={true}
                        />

                        <Checkbox<VolunteerFormValues>
                            name="canCook"
                            label="can you cook?"
                        />

                        <Checkbox<VolunteerFormValues>
                            name="hasCar"
                            label="hat Auto?"
                            
                        />
        
                        <Checkbox<VolunteerFormValues>
                            name="hasDrivingLicense"
                            label="has a driving license?"
                        />

                        <Checkbox<VolunteerFormValues>
                            name="canCarryHeavyStuff"
                            label="can carry heavy stuff?"
                        />

                        <Checkbox<VolunteerFormValues>
                            name="isSocial"
                            label="are you social?"
                        />

                        <Checkbox<VolunteerFormValues>
                            name="canSupportTechnician"
                            label="can you support Tech Team?"
                        />
                        
                        <Checkbox<VolunteerFormValues>
                            name="canSupportArtist"
                            label="can you support Artist?"
                        />
                        
                        <Checkbox<VolunteerFormValues>
                            name="hasMultipleTalents"
                            label="are you multifacetic?"
                        />

                        <Checkbox<VolunteerFormValues>
                            name="canWorkWithChildren"
                            label="can you work with children?"
                        />
                        
                        <Checkbox<VolunteerFormValues>
                            name="canCleanupAfterShow"
                            label="can clean up after show?"
                        />

                        <Checkbox<VolunteerFormValues>
                            name="canCleanupAfterShow"
                            label="can clean up after show?"
                        />
                        
                        <Checkbox<VolunteerFormValues>
                            name="isAvailableOnFriday"
                            label="free on friday?"
                        />

                        <Checkbox<VolunteerFormValues>
                            name="isAvailableOnSaturday"
                            label="free on Saturday?"
                        />

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
        </>
    );
};

export default VolunteerForm;
