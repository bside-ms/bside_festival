'use client';

import ApplicationDurationSelect from '@/components/applications/applicationForm/ApplicationDurationSelect';
import ApplicationLinkList from '@/components/applications/applicationForm/ApplicationLinkList';
import ApplicationParticipantInfo from '@/components/applications/applicationForm/ApplicationParticipantInfo';
import ApplicationSuccess from '@/components/applications/applicationForm/ApplicationSuccess';
import ApplicationTypeImage from '@/components/applications/applicationForm/ApplicationTypeImage';
import ApplicationTypeIntro from '@/components/applications/applicationForm/ApplicationTypeIntro';
import ApplicationZipcodes from '@/components/applications/applicationForm/ApplicationZipcodes';
import ImageUpload from '@/components/applications/applicationForm/ImageUpload';
import TechnicalRiderFields from '@/components/applications/applicationForm/TechnicalRiderFields';
import Checkbox from '@/components/form/Checkbox';
import MultiSelectInput from '@/components/form/MultiSelectInput';
import TextArea from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { addApplication } from '@/lib/actions/applicationActions';
import isWithinApplicationPhase from '@/lib/common/helper/withinApplicationPhase';
import typeLabels from '@/lib/participants/typeLabels';
import {
    applicationAdditionalInfoMaxLength,
    applicationBacklineSharingMaxLength,
    applicationDescriptionMaxLength,
    applicationMotivationMaxLength,
    createApplicationSchema,
} from '@/lib/schemas/applicationSchema';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { Type } from '@prisma/client';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IoWarning } from 'react-icons/io5';
import { z } from 'zod';

export type ApplicationFormValues = z.infer<ReturnType<typeof createApplicationSchema>>;

interface Props {
    chosenType: Type;
    allConcertGenres: Array<{ id: number; name: string }>;
    allDiskJockeyGenres: Array<{ id: number; name: string }>;
}

const ApplicationForm = ({ chosenType, allConcertGenres, allDiskJockeyGenres }: Props): ReactElement => {
    const [submittedRecordId, setSubmittedRecordId] = useState<number | null>(null);

    const methods = useForm<ApplicationFormValues>({
        resolver: zodResolver(createApplicationSchema(chosenType)),
        // participantCount: chosenType === Type.InfoBooth ? undefined : 1,
        // participantZipcodes: chosenType === Type.InfoBooth ? [] : [{ code: "", isInternational: false }],
        defaultValues: {
            publicLinks: [{ url: '' }],
            privateLinks: [{ url: '' }],
            participantCount: chosenType === Type.InfoBooth ? undefined : 1,
            participantZipcodes: chosenType === Type.InfoBooth ? [] : [{ code: '', isInternational: false }],
            flintaParticipantsCount: 0,
            professionalParticipantsCount: 0,
            hasProfessionalParticipants: false,
            hasMarginalizedParticipants: false,
            hasParticipatedBefore: false,
        },
    });
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
            const result = await addApplication(values, chosenType);

            if (!result.id) {
                setError('root', {
                    message:
                        'Leider ist beim Absenden ein unerwarteter Fehler aufgetreten. Versuche es bitte später nochmal! Wenn der Fehler bestehen bleibt, dann melde dich gerne bei uns über festival@b-side.ms oder direkt auf Instagram.',
                });
                return;
            }

            window.scrollTo({ top: 0 });
            setSubmittedRecordId(result.id);
            handleFormReset();
        },
        [chosenType, clearErrors, handleFormReset, setError],
    );

    if (submittedRecordId) {
        return <ApplicationSuccess />;
    }

    let privateLinkDescription =
        'Hörproben, Demotapes, Videos von Auftritten o.ä. für den Auswahl-Prozess unseres Programm-Teams. Beispielsweise als Link zu einem privaten YouTube-Video oder einer Dropbox. Diese Links werden nicht veröffentlicht.';
    if (!(chosenType === Type.Concert || chosenType === Type.DiskJockey)) {
        privateLinkDescription =
            'Material für die Kuration, z.B. Fotos, Videos, PDFs o.ä. für den Auswahl-Prozess unseres Programm-Teams. Beispielsweise als Link zu einem privaten YouTube-Video oder einer Dropbox. Diese Links werden nicht veröffentlicht.';
    }

    return (
        <FormProvider {...methods}>
            <div className="w-full">
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex flex-col gap-6">
                    <div className="font-display">
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

                    {!isWithinApplicationPhase() && (
                        <div className="rounded-md bg-yellow-50 p-4">
                            <div className="flex">
                                <div className="shrink-0">
                                    <IoWarning className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Hinweis</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            Die reguläre Bewerbungsphase ist bereits abgeschlossen. Das Formular steht nur noch für manuelle
                                            Nachträge zur Verfügung.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <ApplicationTypeIntro type={chosenType} />

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
                        maxLength={applicationDescriptionMaxLength}
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

                    {!(chosenType === 'InfoBooth' || chosenType === 'Exhibition') && <ApplicationDurationSelect chosenType={chosenType} />}

                    <div className="flex flex-col gap-10">
                        <ApplicationLinkList
                            name="publicLinks"
                            title="Euer Auftritt auf unserer Website"
                            description="Wo können Besucher*innen unserer Festival-Seite mehr über euch erfahren? (Insta, Web, Spotify). Diese Links werden auf unserer Webseite veröffentlicht, falls ihr beim B-Side Festival dabei seid."
                            maxItems={4}
                        />

                        <ApplicationLinkList
                            name="privateLinks"
                            title="Material für die Kuration"
                            description={privateLinkDescription}
                            maxItems={10}
                        />
                    </div>

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
                            maxLength={applicationBacklineSharingMaxLength}
                            rows={3}
                        />
                    )}

                    <TextArea<ApplicationFormValues>
                        name="motivation"
                        label="Motivation"
                        info="Warum möchtet ihr Teil des B-Side Festivals 2026 sein?"
                        maxLength={applicationMotivationMaxLength}
                    />

                    {chosenType !== Type.InfoBooth && (
                        <>
                            <ApplicationParticipantInfo />
                            <ApplicationZipcodes />
                        </>
                    )}
                    <TextInput<ApplicationFormValues>
                        name="allergies"
                        label="Allergien für Catering"
                        info="Unser Catering ist vegan. Habt ihr Allergien oder Unverträglichkeiten?"
                    />

                    <TextArea<ApplicationFormValues>
                        name="additionalInfo"
                        label="Weitere Informationen"
                        info="Was möchtet ihr uns noch mitteilen?"
                        maxLength={applicationAdditionalInfoMaxLength}
                        rows={3}
                    />

                    <Checkbox<ApplicationFormValues>
                        name="hasParticipatedBefore"
                        label="Ich habe/wir haben in der Vergangenheit schon einmal am B-Side Festival teilgenommen."
                    />

                    <TextInput<ApplicationFormValues> name="contactName" label="Ansprechperson" required={true} />

                    <TextInput<ApplicationFormValues> name="contactMail" label="E-Mail-Adresse" required={true} />

                    <TextInput<ApplicationFormValues> name="contactPhone" label="Telefonnummer" required={true} />
                    <div className="-mt-6 flex gap-2 text-sm">
                        <b>Hinweis:</b> Wenn wir dich buchen benötigen wir eine Telefonnummer für kurzfristige Rückfragen vor dem Festival.
                    </div>

                    <Checkbox
                        name="acceptDataProcessing"
                        label="Ich habe die Datenschutzerklärung gelesen und erkläre mich mit der vertraulichen Verarbeitung meiner Daten einverstanden."
                    />
                    <div className="-mt-6 pl-8">
                        Hier geht's zur{' '}
                        <Link href="https://b-side.ms/kv/datenschutz/" className="underline hover:text-red-600">
                            Datenschutzerklärung
                        </Link>
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

                    {isSubmitting && (
                        <div>
                            Wird gesendet{' '}
                            <span className="ml-1 inline-block animate-spin">
                                <FontAwesomeIcon className="w-3" icon={faSpinner} />
                            </span>
                        </div>
                    )}

                    {errors.root && <div className="mt-2 text-red-600">{errors.root.message}</div>}

                    <div className="mt-5 flex flex-col gap-2 text-sm">
                        <div>
                            Das B-Side Festival ist auch 2026 ein Festival für alle mit vielfältigem und buntem Programm. Dabei wollen wir
                            insbesondere Räume und Bühnen für FLINTA* und andere marginalisierte Gesellschaftsgruppen schaffen.
                        </div>
                        <div>
                            Das B-Side Festival wird nicht kommerziell, ohne Eintrittsgelder und im Sinne der Gemeinnützigkeit für die
                            Allgemeinheit frei zugänglich veranstaltet. Das Festival wird auch dieses Jahr wieder durch öffentliche
                            Fördermittel, Spenden und den Eigenanteil des B-Side Kultur e.V. als Veranstalter finanziert. Im Rahmen unserer
                            finanziellen Möglichkeiten erhalten alle künstlerischen, kulturellen und bildende Programmpunkte eine
                            Aufwandsentschädigung unter Einhaltung der Honoraruntergrenzen für professionelle Künstler*innen.
                        </div>
                        <div>
                            Deine Daten sind bei uns in guten Händen. Wir nutzen die hier gemachten Angaben ausschließlich für den
                            Auswahlprozess und das Booking des B-Side Festivals. Wir geben nichts an Dritte weiter und löschen deine Daten,
                            sobald sie für die Organisation nicht mehr benötigt werden. Mit dem Absenden erklärst du dich damit
                            einverstanden.
                        </div>
                    </div>
                </form>
            </div>
        </FormProvider>
    );
};

export default ApplicationForm;
