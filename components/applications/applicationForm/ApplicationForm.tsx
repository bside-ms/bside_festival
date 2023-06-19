import { useCallback, useState } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Type } from '@prisma/client';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ApplicationSuccess from 'components/applications/applicationForm/ApplicationSuccess';
import ApplicationTypeImage from 'components/applications/applicationForm/ApplicationTypeImage';
import ApplicationTypeIntro from 'components/applications/applicationForm/ApplicationTypeIntro';
import ApplicationTypeSelection from 'components/applications/applicationForm/ApplicationTypeSelection';
import ImageUpload from 'components/applications/applicationForm/ImageUpload';
import Links from 'components/applications/applicationForm/Links';
import TechnicalRiderFields, { getTechnicalRiderInfo } from 'components/applications/applicationForm/TechnicalRiderFields';
import TextArea from 'components/form/TextArea';
import TextInput from 'components/form/TextInput';
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

    const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] = useState(false);

    const methods = useForm<ApplicationFormValues>();
    const { handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors, reset, watch, setValue } = methods;

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

        window.scrollTo({ top: 0 });

        setWasSuccessfullySubmitted(true);

        handleFormReset();

    }, [clearErrors, handleFormReset, setError]);

    const handleTypeSelect = useCallback((type: Type) => {
        setValue('type', type);

        window.scrollTo({ top: 0 });
    }, [setValue]);

    if (wasSuccessfullySubmitted) {
        return <ApplicationSuccess />;
    }

    return (
        <FormProvider {...methods}>
            <div className="w-full">
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    noValidate={true}
                    className="flex gap-6 flex-col"
                >
                    <div className="text-black font-display">
                        <div className="text-2xl">B-Side Festival 2023</div>
                        <div className="text-4xl font-bold">Bewerbung</div>
                    </div>

                    {isEmptyString(currentType) ? (
                        <>
                            <div className="text-black font-bold">
                                Auf dem B-Side Festival gibt es viele verschiedenen Formate. Damit wir
                                den Überblick behalten, haben wir auf dieser Seite verschiedene
                                Bewerbungsformulare zusammengestellt. Sucht euch einfach das Genre
                                aus, das am ehesten zu eurem Programmpunkt passt.
                            </div>

                            <ApplicationTypeSelection onSelect={handleTypeSelect} />
                        </>
                    ) : (
                        <>
                            <div className="relative h-52">
                                <ApplicationTypeImage type={currentType} />

                                <div className="absolute top-0 right-0 bottom-0 left-0 opacity-30 bg-gray-600" />

                                <div className="absolute bottom-0 left-0 right-0 text-white px-2 flex gap-2 items-baseline">
                                    <div className="text-3xl">
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
                            </div>

                            <div className="text-black">
                                <ApplicationTypeIntro type={currentType} />
                            </div>

                            <TextInput<ApplicationFormValues>
                                name="name"
                                label="Name"
                                info="Wie soll euer Programmpunkt im Programmheft heißen?"
                                required={true}
                                maxLength={100}
                            />

                            <ImageUpload />

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
                                required={true}
                            />

                            <TextInput<ApplicationFormValues>
                                name="contactMail"
                                label="E-Mail-Adresse"
                                required={true}
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

                            <label className="w-full bg-black p-1 block">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-black text-white border border-white rounded font-display text-sm leading-3 p-3 disabled:bg-gray-600"
                                >
                                    Absenden
                                </button>
                            </label>

                            {isSubmitting && (
                                <div className="text-black">
                                    Wird gesendet <span className="animate-spin inline-block"><FontAwesomeIcon icon={faSpinner} /></span>
                                </div>
                            )}

                            <div className="mt-5 text-sm flex flex-col gap-2">
                                <div>
                                    Das B-Side Festival ist auch 2023 ein Festival für alle mit vielfältigem und buntem
                                    Programm. Dabei wollen wir insbesondere Räume und Bühnen für FLINTA* und andere
                                    marginalisierte Gesellschaftsgruppen schaffen.
                                </div>
                                <div>
                                    Das B-Side Festival wird nicht kommerziell, ohne Eintrittsgelder und im Sinne der
                                    Gemeinnützigkeit für die Allgemeinheit frei zugänglich veranstaltet. Das Festival
                                    wird auch dieses Jahr wieder durch öffentliche Fördermittel, Spenden und den
                                    Eigenanteil des B-Side Kultur e.V. als Veranstalter finanziert. Im Rahmen
                                    unserer finanziellen Möglichkeiten erhalten alle künstlerischen, kulturellen
                                    und bildende Programmpunkte eine Aufwandsentschädigung.
                                </div>
                            </div>
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
