import { z } from 'zod';
import { Type } from '@prisma/client';
import { getTechnicalRiderInfo } from '@/components/applications/applicationForm';

const linkSchema = z.object({
    url: z.string()
        .trim()
        // If the string isn't empty, it MUST be a valid URL
        .refine(val => val === "" || z.url().safeParse(val).success, {
            message: "Muss eine valide URL sein (inkl. https://)",
        })
});

export const createApplicationSchema = (chosenType: Type) => z.object({
    name: z.string().min(1, "Name ist erforderlich"),
    contactName: z.string().min(1, "Ansprechperson ist erforderlich"),
    contactMail: z.email("Ungültige E-Mail-Adresse"),
    contactPhone: z.string().optional(),
    description: z.string().min(10, "Die Beschreibung ist etwas zu kurz"),
    motivation: z.string().optional(),
    additionalInfo: z.string().optional(),
    participantCount: z.string().min(1, "Bitte gib die Personenzahl an"),
    residence: z.string().optional(),
    // Genres
    concertGenres: z.array(z.union([z.string(), z.number()])).optional(),
    diskJockeyGenres: z.array(z.union([z.string(), z.number()])).optional(),
    // Links
    publicLinks: z.array(linkSchema),
    privateLinks: z.array(linkSchema)
        .refine(links => links.some(l => l.url.trim().length > 0), {
            message: "Bitte gib uns mindestens einen privaten Link (z.B. ein Video von euch)!",
        }),
    // Logic for these usually depends on checkboxes, ensure they are boolean or optional
    hasFlintaParticipants: z.boolean().optional(),
    diversityNotes: z.string().optional(),
    allergies: z.string().optional(),
    encodedImage: z.string().min(1, "Ein Bild ist erforderlich"),
    technicalRider: z.string().optional(),
    encodedTechnicalRiderPdf: z.string().optional(),
}).superRefine((data, ctx) => {
    // Technical Rider Validation Logic
    const riderInfo = getTechnicalRiderInfo(chosenType);
    if (riderInfo?.required) {
        const hasText = data.technicalRider && data.technicalRider.trim().length > 0;
        const hasPdf = data.encodedTechnicalRiderPdf && data.encodedTechnicalRiderPdf.trim().length > 0;

        if (!hasText && !hasPdf) {
            ctx.addIssue({
                code: "custom",
                message: riderInfo.withoutTextArea 
                    ? "Bitte lade einen Technical Rider als PDF hoch" 
                    : "Bitte gib einen Technical Rider an (Text oder PDF)",
                path: ["technicalRider"],
            });
        }
    }
});
