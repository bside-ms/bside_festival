// import { Type } from '@prisma/client'
import { type ReactElement, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ContentWrapper from 'components/common/ContentWrapper';

export interface VolunteerFormValues {
    fullName: string;
    mailAddress: string;
    phoneNumber: string;
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
            fullName: values.fullName,
            mailAddress: values.mailAddress,
            phoneNumber: values.phoneNumber,
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
        const response = await fetch('/api/valunteers/add', {
            method: 'POST', 
            headers: { 'Content-type': 'volunteer/json' }, 
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            setError('root', { message: 'Fehler beim Submit' });
            
        }

        setWasSuccessfullySubmitted(true);
        handleFormReset();
        
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
                        <div>hello world</div>
                    </form>
                </div>
            </FormProvider>
        </>
    );
};

export default VolunteerForm;
