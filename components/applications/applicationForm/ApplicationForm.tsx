import { useCallback, useState } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Type } from '@prisma/client';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ApplicationSuccess from 'components/applications/applicationForm/ApplicationSuccess';
import ApplicationTypeImage from 'components/applications/applicationForm/ApplicationTypeImage';
import ApplicationTypeIntro from 'components/applications/applicationForm/ApplicationTypeIntro';
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
    name: string;
    contactName: string;
    contactPhone: string;
    contactMail: string;
    description: string;
    encodedImage: string;
    motivation: string;
    additionalInfo: string;
    technicalRider?: string;
    encodedTechnicalRiderPdf?: string;
    backlineSharing?: string;
    residence?: string;

    // Proud and also ashamed about this lazy solution
    url1: string;
    url2?: string;
    url3?: string;
    url4?: string;
    url5?: string;
}

interface Props {
    chosenType: Type;
}

const ApplicationForm = ({ chosenType }: Props): ReactElement => {
    const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] = useState(false);

    const methods = useForm<ApplicationFormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
        reset,
    } = methods;

    const handleFormReset = useCallback(() => reset(), [reset]);

    const handleFormSubmit = useCallback(
        async (values: ApplicationFormValues) => {
            clearErrors('root');

            const technicalRiderInfo = getTechnicalRiderInfo(chosenType);

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
                        message:
                            technicalRiderInfo.withoutTextArea === true
                                ? 'Bitte sende uns euren Technical Rider in PDF-Form'
                                : 'Bitte sende uns euren Technical Rider in Text- oder PDF-Form',
                    },
                    {
                        shouldFocus: true,
                    },
                );
                return;
            }

            const request: AddParticipantRequest = {
                type: chosenType,
                name: values.name,
                contactName: values.contactName,
                contactPhone: values.contactPhone,
                contactMail: values.contactMail,
                description: values.description,
                encodedImage: values.encodedImage,
                motivation: values.motivation,
                additionalInfo: values.additionalInfo,
                technicalRider: values.technicalRider ?? null,
                encodedTechnicalRiderPdf: values.encodedTechnicalRiderPdf ?? null,
                backlineSharing: values.backlineSharing ?? null,
                residence: values.residence ?? null,
                links: [values.url1, values.url2, values.url3, values.url4, values.url5].filter(isNotEmptyString),
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
        },
        [chosenType, clearErrors, handleFormReset, setError],
    );

    if (wasSuccessfullySubmitted) {
        return <ApplicationSuccess />;
    }

    return (
        <FormProvider {...methods}>
            <div className="w-full">
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex gap-6 flex-col">
                    <div className="text-black font-display">
                        <div className="text-4xl font-bold">Bewerbung</div>
                    </div>

                    <div className="relative h-52">
                        <ApplicationTypeImage type={chosenType} />

                        <div className="absolute top-0 right-0 bottom-0 left-0 opacity-30 bg-gray-600" />

                        <div className="absolute bottom-0 left-0 right-0 text-white px-2 flex gap-2 items-baseline">
                            <div className="text-3xl">
                                <strong>{typeLabels[chosenType]}</strong>
                            </div>

                            {!isSubmitting && (
                                <Link href="/bewerbungen" className="cursor-pointer text-sm">
                                    ändern
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="text-black">
                        <ApplicationTypeIntro type={chosenType} />
                    </div>

                    <TextInput<ApplicationFormValues>
                        name="name"
                        label="Name"
                        info="Wie soll euer Programmpunkt im Programmheft heißen?"
                        required={true}
                        maxLength={100}
                    />

                    <ImageUpload chosenType={chosenType} />

                    <TextArea<ApplicationFormValues>
                        name="description"
                        label="Beschreibung"
                        additionalInfo="Beachtet: Dies ist ein Pressetext. Dieser Text wird auf unserer Webseite veröffentlicht, falls ihr beim B-Side Festival dabei sein werdet."
                    />

                    <Links />

                    {chosenType !== Type.Neighbor && <TextInput<ApplicationFormValues> name="residence" label="Wohnort" />}

                    <TechnicalRiderFields chosenType={chosenType} />

                    {chosenType === Type.Concert && (
                        <TextArea<ApplicationFormValues>
                            name="backlineSharing"
                            label="Ja, wir können folgendes bereitstellen …"
                            info={`
                                Für schnelle Umbauzeiten sind wir womöglich darauf angewiesen, die Backline der Acts wiederzuverwenden.
                                Könnt ihr euch vorstellen hierfür, Teile eurer Backline bereitzustellen und wenn ja, was wäre das
                                (beispielsweise Amps und Boxen)?
                            `}
                            rows={3}
                        />
                    )}

                    <TextInput<ApplicationFormValues> name="contactName" label="Ansprechperson" required={true} />

                    <TextInput<ApplicationFormValues> name="contactMail" label="E-Mail-Adresse" required={true} />

                    <TextInput<ApplicationFormValues> name="contactPhone" label="Telefonnummer" />

                    <TextArea<ApplicationFormValues>
                        name="motivation"
                        label="Motivation"
                        info="Warum möchtet ihr Teil des B-Side Festivals 2024 sein?"
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
                            Wird gesendet{' '}
                            <span className="ml-1 animate-spin inline-block">
                                <FontAwesomeIcon className="w-3" icon={faSpinner} />
                            </span>
                        </div>
                    )}

                    <div className="mt-5 text-sm flex flex-col gap-2">
                        <div>
                            Das B-Side Festival ist auch 2024 ein Festival für alle mit vielfältigem und buntem Programm. Dabei wollen wir
                            insbesondere Räume und Bühnen für FLINTA* und andere marginalisierte Gesellschaftsgruppen schaffen.
                        </div>
                        <div>
                            Das B-Side Festival wird nicht kommerziell, ohne Eintrittsgelder und im Sinne der Gemeinnützigkeit für die
                            Allgemeinheit frei zugänglich veranstaltet. Das Festival wird auch dieses Jahr wieder durch öffentliche
                            Fördermittel, Spenden und den Eigenanteil des B-Side Kultur e.V. als Veranstalter finanziert. Im Rahmen unserer
                            finanziellen Möglichkeiten erhalten alle künstlerischen, kulturellen und bildende Programmpunkte eine
                            Aufwandsentschädigung.
                        </div>
                    </div>
                </form>

                {errors.root && <div className="mt-2 text-red-600">{errors.root.message}</div>}
            </div>
        </FormProvider>
    );
};

export default ApplicationForm;
