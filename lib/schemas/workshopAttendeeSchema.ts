import { z } from 'zod';

export const workshopAttendeeMessageMaxLength = 500;

export const workshopAttendeeRegistrationSchema = z.object({
    scheduleEntryId: z.number().int().positive(),
    fullName: z.string().trim().min(1, 'Name ist erforderlich'),
    mailAddress: z.email('Ungültige E-Mail-Adresse').transform((value) => value.trim().toLowerCase()),
    message: z.string().trim().max(workshopAttendeeMessageMaxLength, `Max. ${workshopAttendeeMessageMaxLength} Zeichen`).optional(),
    acceptDataProcessing: z
        .boolean()
        .refine((value) => value === true, { message: 'Bitte akzeptiere die Datenschutzerklärung, um fortzufahren.' }),
});

export type WorkshopAttendeeRegistrationValues = z.infer<typeof workshopAttendeeRegistrationSchema>;
