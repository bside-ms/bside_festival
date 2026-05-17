import { getTechnicalRiderInfo } from '@/components/applications/applicationForm/TechnicalRiderFields';
import { Type } from '@prisma/client';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { z } from 'zod';

export const applicationAdditionalInfoMaxLength = 1500;
export const applicationBacklineSharingMaxLength = 1000;
export const applicationDescriptionMaxLength = 1500;
export const applicationDiversityNotesMaxLength = 1500;
export const applicationMotivationMaxLength = 1500;
export const applicationParticipantCountMax = 100;
export const applicationTechnicalRiderMaxLength = 4000;
const applicationParticipantCountMaxMessage = `Max. ${applicationParticipantCountMax} Personen`;

const phoneSchema = z.string().transform((arg, ctx) => {
    const cleaned = arg.trim();
    const phone = parsePhoneNumberFromString(cleaned, 'DE');

    if (phone && phone.isValid()) {
        return phone.number as string;
    }

    ctx.addIssue({
        code: 'custom',
        message: 'Ungültige Telefonnummer',
    });

    return '';
});

const linkSchema = z.object({
    url: z
        .string()
        .trim()
        // If the string isn't empty, it MUST be a valid URL
        .refine((val) => val === '' || z.url().safeParse(val).success, {
            message: 'Muss eine valide URL sein (inkl. https://)',
        }),
});

const zipcodeSchema = z
    .object({
        code: z.string().trim(),
        isInternational: z.boolean(),
    })
    .refine(
        (data) => {
            if (!data.isInternational) {
                // German Zipcode Regex: 5 digits
                // TODO: Refine this
                return /^\d{5}$/.test(data.code);
            }
            // For international, just ensure it's not empty
            return data.code.length > 0;
        },
        {
            message: 'Bitte gültige PLZ (5 Stellen) oder Land angeben',
            path: ['code'],
        },
    );

export const createUpdateApplicationBookingInfoSchema = (participantCount: number) =>
    z
        .object({
            isProfessionalBooking: z.boolean().optional(),
            professionalParticipantsCount: z
                .number()
                .int('Bitte gib eine ganze Zahl ein')
                .min(0, 'Die Anzahl darf nicht negativ sein')
                .max(applicationParticipantCountMax, applicationParticipantCountMaxMessage)
                .optional(),
        })
        .superRefine(({ isProfessionalBooking, professionalParticipantsCount }, ctx) => {
            if (isProfessionalBooking) {
                return;
            }

            const professionalCount = professionalParticipantsCount ?? 0;

            if (professionalCount > participantCount) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Mehr Profis als Bandmitglieder? Das geht leider nicht.',
                    path: ['professionalParticipantsCount'],
                });
            }
        });

export const createUpdateApplicationDiversityInfoSchema = (participantCount: number) =>
    z
        .object({
            flintaParticipantsCount: z
                .number()
                .int('Bitte gib eine ganze Zahl ein')
                .min(0, 'Die Anzahl darf nicht negativ sein')
                .max(applicationParticipantCountMax, applicationParticipantCountMaxMessage),
            hasMarginalizedParticipants: z.boolean(),
            diversityNotes: z
                .string()
                .max(applicationDiversityNotesMaxLength, `Max. ${applicationDiversityNotesMaxLength} Zeichen`)
                .optional(),
        })
        .superRefine(({ flintaParticipantsCount }, ctx) => {
            if (flintaParticipantsCount > participantCount) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Die Anzahl der FLINTA* Personen kann nicht größer sein als die Gesamtzahl.',
                    path: ['flintaParticipantsCount'],
                });
            }
        });

export const updateApplicationAdditionalInfoSchema = z.object({
    additionalInfo: z.string().max(applicationAdditionalInfoMaxLength, `Max. ${applicationAdditionalInfoMaxLength} Zeichen`).optional(),
});

export const updateApplicationDescriptionSchema = z.object({
    description: z
        .string()
        .min(10, 'Die Beschreibung ist etwas zu kurz')
        .max(applicationDescriptionMaxLength, `Max. ${applicationDescriptionMaxLength} Zeichen`),
});

export const updateApplicationContactInfoSchema = z.object({
    contactName: z.string().min(1, 'Ansprechperson ist erforderlich'),
    contactMail: z.email('Ungültige E-Mail-Adresse'),
    contactPhone: phoneSchema,
});

export const updateApplicationDurationPreferenceSchema = z.object({
    durationPreference: z.string().min(1, 'Bitte gebt an, wie lange ihr performen möchtet.'),
});

export const updateApplicationMotivationSchema = z.object({
    motivation: z.string().max(applicationMotivationMaxLength, `Max. ${applicationMotivationMaxLength} Zeichen`).optional(),
});

export const updateApplicationPastParticipationSchema = z.object({
    hasParticipatedBefore: z.enum(['unknown', 'yes', 'no']),
});

export const updateApplicationJuryVotesSchema = z.object({
    juryVotes: z.array(z.number().int().min(0).max(5)),
});

export const updateApplicationNameSchema = z.object({
    name: z.string().min(1, 'Name ist erforderlich'),
});

export const createUpdateApplicationParticipantCountSchema = (minimumParticipantCount = 1) =>
    z.object({
        participantCount: z
            .number()
            .int('Bitte gib eine ganze Zahl ein')
            .min(
                minimumParticipantCount,
                minimumParticipantCount === 1
                    ? 'Mindestens eine Person muss dabei sein'
                    : 'Die Personenanzahl darf nicht kleiner als bereits erfasste Teilwerte sein',
            )
            .max(applicationParticipantCountMax, applicationParticipantCountMaxMessage),
    });

export const updateApplicationParticipantCountSchema = createUpdateApplicationParticipantCountSchema();

export const createApplicationSchema = (chosenType: Type) =>
    z
        .object({
            name: z.string().min(1, 'Name ist erforderlich'),
            encodedImage: z.string().min(1, 'Ein Bild ist erforderlich'),
            description: z
                .string()
                .min(10, 'Die Beschreibung ist etwas zu kurz')
                .max(applicationDescriptionMaxLength, `Max. ${applicationDescriptionMaxLength} Zeichen`),
            concertGenres: z.array(z.union([z.string(), z.number()])).optional(),
            diskJockeyGenres: z.array(z.union([z.string(), z.number()])).optional(),
            durationPreference: z.string().optional(),

            publicLinks: z.array(linkSchema),
            privateLinks: z.array(linkSchema).refine((links) => links.some((l) => l.url.trim().length > 0), {
                message: 'Bitte gib uns mindestens einen privaten Link (z.B. ein Video von euch)!',
            }),
            technicalRider: z
                .string()
                .max(applicationTechnicalRiderMaxLength, `Max. ${applicationTechnicalRiderMaxLength} Zeichen`)
                .optional(),
            encodedTechnicalRiderPdf: z.string().optional(),
            backlineSharing: z
                .string()
                .max(applicationBacklineSharingMaxLength, `Max. ${applicationBacklineSharingMaxLength} Zeichen`)
                .optional(),

            motivation: z.string().max(applicationMotivationMaxLength, `Max. ${applicationMotivationMaxLength} Zeichen`).optional(),
            participantCount: z
                .number()
                .int('Bitte gib eine ganze Zahl ein')
                .min(1, 'Mindestens eine Person muss dabei sein')
                .max(applicationParticipantCountMax, applicationParticipantCountMaxMessage)
                .optional(),
            hasMarginalizedParticipants: z.boolean(),
            flintaParticipantsCount: z
                .number()
                .int('Bitte gib eine ganze Zahl ein')
                .min(0, 'Die Anzahl darf nicht negativ sein')
                .max(applicationParticipantCountMax, applicationParticipantCountMaxMessage),
            isProfessionalBooking: z.boolean().optional(),
            hasProfessionalParticipants: z.boolean(),
            professionalParticipantsCount: z
                .number()
                .int('Bitte gib eine ganze Zahl ein')
                .min(0, 'Die Anzahl darf nicht negativ sein')
                .max(applicationParticipantCountMax, applicationParticipantCountMaxMessage)
                .optional(),
            participantZipcodes: z.array(zipcodeSchema).optional(),
            hasParticipatedBefore: z.boolean().optional(),

            diversityNotes: z
                .string()
                .max(applicationDiversityNotesMaxLength, `Max. ${applicationDiversityNotesMaxLength} Zeichen`)
                .optional(),
            allergies: z.string().optional(),
            additionalInfo: z
                .string()
                .max(applicationAdditionalInfoMaxLength, `Max. ${applicationAdditionalInfoMaxLength} Zeichen`)
                .optional(),

            contactName: z.string().min(1, 'Ansprechperson ist erforderlich'),
            contactMail: z.email('Ungültige E-Mail-Adresse'),
            contactPhone: phoneSchema,
            acceptDataProcessing: z.literal(true, { message: 'Bitte akzeptiere die Datenschutzerklärung, um fortzufahren.' }),
        })
        .superRefine((data, ctx) => {
            const riderInfo = getTechnicalRiderInfo(chosenType);

            if (riderInfo?.required) {
                const hasText = data.technicalRider && data.technicalRider.trim().length > 0;
                const hasPdf = data.encodedTechnicalRiderPdf && data.encodedTechnicalRiderPdf.trim().length > 0;

                if (!hasText && !hasPdf) {
                    ctx.addIssue({
                        code: 'custom',
                        message: riderInfo.withoutTextArea
                            ? 'Bitte lade einen Technical Rider als PDF hoch'
                            : 'Bitte gib einen Technical Rider an (Text oder PDF)',
                        path: ['technicalRider'],
                    });
                }
            }

            if (!(chosenType === 'InfoBooth' || chosenType === 'Exhibition')) {
                if (data.durationPreference === undefined || data.durationPreference.length < 1) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Bitte gebt an, wie lange ihr performen möchtet.',
                        path: ['durationPreference'],
                    });
                }
            }

            if (chosenType !== Type.InfoBooth) {
                if (data.participantCount === undefined || data.participantCount < 1) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Mindestens eine Person muss dabei sein',
                        path: ['participantCount'],
                    });
                }

                if (!data.participantZipcodes || data.participantZipcodes.length === 0) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Bitte gib die Postleitzahlen der Mitglieder an.',
                        path: ['participantZipcodes'],
                    });
                }

                // Logic checks that rely on participantCount
                const participantCount = data.participantCount || 0;

                if (data.flintaParticipantsCount > participantCount) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Die Anzahl der FLINTA* Personen kann nicht größer sein als die Gesamtzahl.',
                        path: ['flintaParticipantsCount'],
                    });
                }

                if (data.hasProfessionalParticipants) {
                    const profCount = data.professionalParticipantsCount || 0;

                    if (profCount > participantCount) {
                        ctx.addIssue({
                            code: 'custom',
                            message: 'Mehr Profis als Bandmitglieder? Das geht leider nicht.',
                            path: ['professionalParticipantsCount'],
                        });
                    }

                    if (profCount <= 0) {
                        ctx.addIssue({
                            code: 'custom',
                            message: 'Bitte gib an, wie viele Profis dabei sind.',
                            path: ['professionalParticipantsCount'],
                        });
                    }
                }
            }
        });
