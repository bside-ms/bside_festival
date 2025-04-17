'use client';

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
import type { AddParticipantRequest } from 'app/api/applications/add/route';
import Checkbox from 'components/form/Checkbox';
import MultiSelectInput from 'components/form/MultiSelectInput';

export interface ApplicationFormValues {
    name: string;
    contactName: string;
    contactPhone: string;
    contactMail: string;
    description: string;
    concertGenres?: Array<string | number>;
    diskJockeyGenres?: Array<string | number>;
    encodedImage: string;
    motivation: string;
    additionalInfo: string;
    technicalRider?: string;
    encodedTechnicalRiderPdf?: string;
    backlineSharing?: string;
    materialExpenses?: string;
    residence?: string;
    participantCount: string;
    hasFlintaParticipants: boolean;
    hasMarginalizedParticipants: boolean;
    diversityNotes: string;
    allergies: string;

    // Proud and also ashamed about this lazy solution
    url1: string;
    url2?: string;
    url3?: string;
    url4?: string;
    url5?: string;
}

interface Props {
    chosenType: Type;
    allConcertGenres: Array<{ id: number; name: string }>;
    allDiskJockeyGenres: Array<{ id: number; name: string }>;
}

const ApplicationForm = ({ chosenType, allConcertGenres, allDiskJockeyGenres }: Props): ReactElement => {
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
                concertGenres: values.concertGenres ?? [],
                diskJockeyGenres: values.diskJockeyGenres ?? [],
                encodedImage: values.encodedImage,
                motivation: values.motivation,
                additionalInfo: values.additionalInfo,
                technicalRider: values.technicalRider ?? null,
                encodedTechnicalRiderPdf: values.encodedTechnicalRiderPdf ?? null,
                backlineSharing: values.backlineSharing ?? null,
                materialExpenses: values.materialExpenses ?? null,
                residence: values.residence ?? null,
                participantCount: values.participantCount,
                hasFlintaParticipants: values.hasFlintaParticipants,
                hasMarginalizedParticipants: values.hasMarginalizedParticipants,
                diversityNotes: values.diversityNotes,
                allergies: values.allergies,
                links: [values.url1, values.url2, values.url3, values.url4, values.url5].filter(isNotEmptyString),
            };

            const response = await fetch('/api/applications/add', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                setError('root', {
                    message:
                        'Leider ist beim Absenden ein unerwarteter Fehler aufgetreten. Versuche es bitte später nochmal! Wenn der Fehler bestehen bleibt, dann melde dich gerne bei uns über festival@b-side.ms oder direkt auf Instagram.',
                });
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
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex flex-col gap-6">
                    <div className="font-display text-white">
                        <div className="text-4xl font-bold">B-werbung</div>
                    </div>

                    <div className="relative h-52">
                        <ApplicationTypeImage type={chosenType} />

                        <div className="absolute inset-0 bg-gray-600 opacity-30" />

                        <div className="absolute inset-x-0 bottom-0 flex items-baseline gap-2 px-2 text-white">
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

                    <div className="text-white">
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
                        required={true}
                        additionalInfo={`
                            Beachtet: Dies ist euer endgültiger Pressetext. Dieser Text wird auf unserer
                            Webseite veröffentlicht, falls ihr beim B-Side Festival dabei sein werdet.
                            Bitte achtet daher auf Vollständigkeit.
                        `}
                    />

                    {chosenType === 'Concert' && (
                        <MultiSelectInput<ApplicationFormValues>
                            name="concertGenres"
                            label="Musikrichtungen"
                            info="Welche Genres beschreiben eure Musik am besten?"
                            options={allConcertGenres.map(({ id, name }) => ({ id, label: name }))}
                        />
                    )}

                    {chosenType === 'DiskJockey' && (
                        <MultiSelectInput<ApplicationFormValues>
                            name="diskJockeyGenres"
                            label="Musikrichtungen"
                            info="Welche Genres beschreiben eure Musik am besten?"
                            options={allDiskJockeyGenres.map(({ id, name }) => ({ id, label: name }))}
                        />
                    )}

                    <Links />

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

                    <TextArea<ApplicationFormValues>
                        name="motivation"
                        label="Motivation"
                        info="Warum möchtet ihr Teil des B-Side Festivals 2025 sein?"
                    />

                    <TextInput<ApplicationFormValues>
                        name="participantCount"
                        label="Gesamtanzahl"
                        info="Wie viel Menschen sind an eurem Beitrag beteiligt?"
                    />

                    <div className="text-white">
                        Zum Ausgleich bestehender Nachteile freuen wir uns über Bewerbungen von Menschen und Organisationen, die sich für
                        Menschen mit Diskriminierungserfahrung stark machen oder selbst davon betroffen sind. Dazu zählen zum Beispiel
                        geflüchtete Menschen, Jüdinnen*Juden, Menschen mit familiärer Migrations- oder Fluchtgeschichte, muslimisch(e)
                        (gelesene) Menschen, Personen of Color, Sinti/Roma*, schwarze Menschen und/oder Menschen, die aufgrund ihres Alters,
                        sozialen Status oder einer Behinderung/chronischen Krankheit benachteiligt werden (marginalisierte Gruppen). Wir
                        freuen uns ebenso über Bewerbungen von Frauen, lesbischen, nicht-binären, intergeschlechtlichen, trans und agender
                        Personen (FLINTA*).
                    </div>

                    <Checkbox<ApplicationFormValues> name="hasFlintaParticipants" label="Es sind FLINTA* Personen beteiligt?" />

                    <Checkbox<ApplicationFormValues>
                        name="hasMarginalizedParticipants"
                        label="Es sind Personen anderer marginalisierter Gruppen beteiligt?"
                    />

                    <TextArea<ApplicationFormValues> name="diversityNotes" label="Anmerkungen zur Diversität" rows={2} />

                    <TextInput<ApplicationFormValues>
                        name="allergies"
                        label="Allergien für Catering"
                        info="Unser Catering ist vegan. Habt ihr Allergien?"
                    />

                    <TextArea<ApplicationFormValues>
                        name="additionalInfo"
                        label="Weitere Informationen"
                        info="Was möchtet ihr uns noch mitteilen?"
                        rows={3}
                    />

                    <TextInput<ApplicationFormValues> name="contactName" label="Ansprechperson" required={true} />

                    <TextInput<ApplicationFormValues> name="contactMail" label="E-Mail-Adresse" required={true} />

                    <TextInput<ApplicationFormValues> name="contactPhone" label="Telefonnummer" />

                    {chosenType !== Type.Neighbor && <TextInput<ApplicationFormValues> name="residence" label="Wohnort" />}

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
                        <div className="text-white">
                            Wird gesendet{' '}
                            <span className="ml-1 inline-block animate-spin">
                                <FontAwesomeIcon className="w-3" icon={faSpinner} />
                            </span>
                        </div>
                    )}

                    {errors.root && <div className="mt-2 text-red-600">{errors.root.message}</div>}

                    <div className="mt-5 flex flex-col gap-2 text-sm text-white">
                        <div>
                            Das B-Side Festival ist auch 2025 ein Festival für alle mit vielfältigem und buntem Programm. Dabei wollen wir
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
            </div>
        </FormProvider>
    );
};

export default ApplicationForm;
