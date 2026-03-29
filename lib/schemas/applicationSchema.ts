import { getTechnicalRiderInfo } from '@/components/applications/applicationForm/TechnicalRiderFields';
import { Type } from '@prisma/client';
import { z } from 'zod';

const linkSchema = z.object({
    url: z
        .string()
        .trim()
        // If the string isn't empty, it MUST be a valid URL
        .refine((val) => val === '' || z.url().safeParse(val).success, {
            message: 'Muss eine valide URL sein (inkl. https://)',
        }),
});

const zipcodeSchema = z.object({
    code: z.string().trim(),
    isInternational: z.boolean(),
}).refine((data) => {
    if (!data.isInternational) {
        // German Zipcode Regex: 5 digits
        // TODO: Refine this
        return /^\d{5}$/.test(data.code);
    }
    // For international, just ensure it's not empty
    return data.code.length > 0;
}, {
    message: "Bitte gültige PLZ (5 Stellen) oder Land angeben",
    path: [ "code" ]
});

export const createApplicationSchema = (chosenType: Type) =>
    z
        .object({
            name: z.string().min(1, 'Name ist erforderlich'),
            encodedImage: z.string().min(1, 'Ein Bild ist erforderlich'),
            description: z.string().min(10, 'Die Beschreibung ist etwas zu kurz'),
            concertGenres: z.array(z.union([z.string(), z.number()])).optional(),
            diskJockeyGenres: z.array(z.union([z.string(), z.number()])).optional(),
            durationPreference: z.string().min(1, 'Bitte gib an, wie lange du/ihr spielen möchtet.'),

            publicLinks: z.array(linkSchema),
            privateLinks: z.array(linkSchema).refine((links) => links.some((l) => l.url.trim().length > 0), {
                message: 'Bitte gib uns mindestens einen privaten Link (z.B. ein Video von euch)!',
            }),
            technicalRider: z.string().optional(),
            encodedTechnicalRiderPdf: z.string().optional(),
            backlineSharing: z.string().optional(),

            motivation: z.string().optional(),
            participantCount: z.number().min(1, 'Mindestens eine Person muss dabei sein'),
            hasMarginalizedParticipants: z.boolean(),
            flintaParticipantsCount: z.number().min(0),
            hasProfessionalParticipants: z.boolean(),
            professionalParticipantsCount: z.number().min(0),
            participantZipcodes: z.array(zipcodeSchema),

            diversityNotes: z.string().optional(),
            allergies: z.string().optional(),
            additionalInfo: z.string().optional(),

            contactName: z.string().min(1, 'Ansprechperson ist erforderlich'),
            contactMail: z.email('Ungültige E-Mail-Adresse'),
            contactPhone: z.string().optional(),

            residence: z.string().optional(),
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

            if (data.flintaParticipantsCount > data.participantCount) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Die Anzahl der FLINTA* Personen kann nicht größer sein als die Gesamtzahl.',
                    path: ['flintaParticipantsCount'],
                });
            }

            if (data.hasProfessionalParticipants && data.professionalParticipantsCount > data.participantCount) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Mehr Profis als Bandmitglieder? Das geht leider nicht.',
                    path: ['professionalParticipantsCount'],
                });
            }

            if (data.hasProfessionalParticipants && data.professionalParticipantsCount <= 0) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Bitte gib an, wie viele Profis dabei sind.',
                    path: ['professionalParticipantsCount'],
                });
            }
        });
