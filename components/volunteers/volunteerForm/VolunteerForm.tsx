// import { Type } from '@prisma/client'
import { type ReactElement, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { ApplicationFormValues } from 'components/applications/applicationForm/ApplicationForm';

// do i also need a type? 
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

    const methods = useForm<VolunteerFormValues>();
    const { handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors, reset, watch } = methods;
    
    const handleFormReset = useCallback(() => reset(), [reset]);

    // what should i watch here?,
    const currentType = watch('');

    const handleFormSubmit = useCallback(async (values: ApplicationFormValues) => {
        // What does root do? i couldnt find any information about it. 
        clearErrors('root');
        
    // const request = {
    // type: values.type,    
    // fullName: values.fullName,
    // mailAddress: values.mailAddress,
    // phoneNumber: values.photoNumber,
    // canCook: values.canCook,
    // hasCar: values.hasCar,
    // hasDrivingLicense: values.hasDrivingLicense,
    // canCarryHeavyStuff: values.canCarryHeavyStuff,
    // canLiftHeavyStuff: values.canLiftHeavyStuff,
    // isSocial: values.isSocial,
    // canSupportTechnician: values.canSupportTechnician,
    // canSupportArtist: values.canSupportArtist,
    // hasMultipleTalents: values.hasMultipleTalents,
    // canWorkWithChildren: values.canWorkWithChildren,
    // canCleanupAfterShow: values.canCleanupAfterShow,
    // isAvailableOnFriday: values.isAvailableOnFriday,
    // isAvailableOnSaturday: values.isAvailableOnSaturday,

    // };

    }, [clearErrors, handleFormReset, setError]);

    return (
        <FormProvider {...methods}>
            <div className ="w-full">
                <form
                onSubmit={handleSubmit(handleFormSubmit)}
                noValidate={true}
                className="flex gap-6 flex-col"
                >
                <div>Hello World</div>
            </div>
        </FormProvider>
    );
};

export default VolunteerForm;
