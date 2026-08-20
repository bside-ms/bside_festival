import parsePhoneNumberFromString from 'libphonenumber-js';
import { z } from 'zod';

export const volunteerAdditionalInfoMaxLength = 500;

const volunteerPhoneSchema = z.string().transform((arg, ctx) => {
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

export const volunteerSignupSchema = z.object({
    fullName: z.string().trim().min(1, 'Name ist erforderlich'),
    mailAddress: z.email('Ungültige E-Mail-Adresse'),
    phoneNumber: volunteerPhoneSchema,
    additionalInfo: z.string().max(volunteerAdditionalInfoMaxLength, `Max. ${volunteerAdditionalInfoMaxLength} Zeichen`).optional(),
    acceptDataProcessing: z
        .boolean()
        .refine((value) => value === true, { message: 'Bitte akzeptiere die Datenschutzerklärung, um fortzufahren.' }),
});

export type VolunteerSignupValues = z.infer<typeof volunteerSignupSchema>;
