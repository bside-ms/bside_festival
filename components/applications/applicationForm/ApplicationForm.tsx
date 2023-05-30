import { useCallback } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Type } from '@prisma/client';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ImageUpload from 'components/applications/applicationForm/ImageUpload';
import Links from 'components/applications/applicationForm/Links';
import TechnicalRiderFields, { getTechnicalRiderInfo } from 'components/applications/applicationForm/TechnicalRiderFields';
import Button from 'components/common/Button';
import SelectInput from 'components/form/SelectInput';
import TextArea from 'components/form/TextArea';
import TextInput from 'components/form/TextInput';
import availableTypes from 'lib/applications/availableTypes';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import typeLabels from 'lib/participants/typeLabels';
import type { AddParticipantRequest } from 'pages/api/applications/add';

export interface ApplicationFormValues {
    type: Type;
    name: string;
    contactName: string;
    contactPhone: string;
    contactMail: string;
    description: string;
    encodedImage: string;
    motivation: string;
    additionalInfo: string;
    technicalRider: string;
    encodedTechnicalRiderPdf: string;
    residence: string;

    // Proud and also ashamed about this lazy solution
    url1: string;
    url2: string;
    url3: string;
    url4: string;
    url5: string;
}

const ApplicationForm = (): ReactElement => {

    const methods = useForm<ApplicationFormValues>();
    const { handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors, reset, watch } = methods;

    const router = useRouter();

    const handleFormReset = useCallback(() => reset(), [reset]);

    const currentType = watch('type');

    const handleFormSubmit = useCallback(async (values: ApplicationFormValues) => {

        clearErrors('root');

        const technicalRiderInfo = getTechnicalRiderInfo(values.type);

        if (
            technicalRiderInfo !== null &&
            technicalRiderInfo.required === true &&
            isEmptyString(values.technicalRider) &&
            isEmptyString(values.encodedTechnicalRiderPdf)
        ) {
            setError(
                'technicalRider',
                {
                    type: 'manual',
                    message: 'Bitte sende uns euren Technical Rider in Text- oder PDF-Form',
                },
                {
                    shouldFocus: true,
                }
            );
            return;
        }

        const request: AddParticipantRequest = {
            type: values.type,
            name: values.name,
            contactName: values.contactName,
            contactPhone: values.contactPhone,
            contactMail: values.contactMail,
            description: values.description,
            encodedImage: values.encodedImage,
            motivation: values.motivation,
            additionalInfo: values.additionalInfo,
            technicalRider: values.technicalRider,
            encodedTechnicalRiderPdf: values.encodedTechnicalRiderPdf,
            residence: values.residence,
            links: [
                values.url1,
                values.url2,
                values.url3,
                values.url4,
                values.url5,
            ].filter(isNotEmptyString),
        };

        const response = await fetch('/api/applications/add', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            setError('root', { message: 'Fehler beim Submit!' });
            return;
        }

        window.scrollTo({ behavior: 'smooth' });

        handleFormReset();

        router.push('/bewerbungen/danke');

    }, [clearErrors, handleFormReset, router, setError]);

    return (
        <FormProvider {...methods}>
            <div className="w-full">
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    noValidate={true}
                    className="flex gap-6 flex-col"
                >

                    {isEmptyString(currentType) ? (
                        <SelectInput<ApplicationFormValues>
                            name="type"
                            label="Art der Bewerbung"
                            options={availableTypes.map(type => ({ value: type, label: typeLabels[type] }))}
                            required={true}
                            info=""
                        />
                    ) : (
                        <>
                            <div className="text-gray-100 flex gap-2 items-baseline">
                                <div className="text-xl">
                                    <strong>{typeLabels[currentType]}</strong>
                                </div>

                                {!isSubmitting && (
                                    <a
                                        onClick={handleFormReset}
                                        className="cursor-pointer text-sm"
                                    >
                                        ändern
                                    </a>
                                )}
                            </div>

                            <TextInput<ApplicationFormValues>
                                name="name"
                                label="Name"
                                info="Wie soll euer Programmpunkt im Programmheft heißen?"
                                required={true}
                                maxLength={100}
                            />

                            <ImageUpload
                                required={true}
                            />

                            <TextArea<ApplicationFormValues>
                                name="description"
                                label="Beschreibung"
                                info="Dies ist ein Pressetext und wird auf unserer Webseite veröffentlicht."
                            />

                            <Links />

                            {currentType !== Type.Neighbor && (
                                <TextInput<ApplicationFormValues>
                                    name="residence"
                                    label="Wohnort"
                                />
                            )}

                            <TechnicalRiderFields />

                            <TextInput<ApplicationFormValues>
                                name="contactName"
                                label="Ansprechperson"
                                // required={true}
                            />

                            <TextInput<ApplicationFormValues>
                                name="contactMail"
                                label="E-Mail-Adresse"
                                // required={true}
                            />

                            <TextInput<ApplicationFormValues>
                                name="contactPhone"
                                label="Telefonnummer"
                            />

                            <TextArea<ApplicationFormValues>
                                name="motivation"
                                label="Motivation"
                                info="Warum möchtet ihr Teil des B-Side Festivals 2023 sein?"
                            />

                            <TextArea<ApplicationFormValues>
                                name="additionalInfo"
                                label="Weitere Informationen"
                                info="Was möchten ihr uns noch mitteilen?"
                            />

                            <div>
                                <Button type="submit" withFullWidth={true} isDisabled={isSubmitting}>
                                    Absenden
                                </Button>
                            </div>

                            {isSubmitting && (
                                <div className="text-gray-100">
                                    Wird gesendet <span className="animate-spin inline-block"><FontAwesomeIcon icon={faSpinner} /></span>
                                </div>
                            )}
                        </>
                    )}
                </form>

                {errors.root && (
                    <div className="mt-2 text-red-600">
                        {errors.root.message}
                    </div>
                )}
            </div>
        </FormProvider>
    );
};

export default ApplicationForm;
