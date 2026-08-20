'use server';

import prismaClient from '@/lib/common/prismaClient';
import { loggedAction } from '@/lib/errorLog/loggedAction';
import { recordActionError } from '@/lib/errorLog/recordActionError';
import sendVolunteerConfirmationMail from '@/lib/mail/sendVolunteerConfirmationMail';
import sendVolunteerWelcomeMail from '@/lib/mail/sendVolunteerWelcomeMail';
import { volunteerSignupSchema, type VolunteerSignupValues } from '@/lib/schemas/volunteerSchema';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';

const volunteerVerificationTtlMs = 3 * 24 * 60 * 60 * 1000;

const normalizeOptionalText = (value: string | undefined): string | null => {
    if (value === undefined || value.trim().length === 0) {
        return null;
    }

    return value.trim();
};

export const addVolunteer = loggedAction(
    'addVolunteer',
    async (data: VolunteerSignupValues): Promise<void> => {
        const values = volunteerSignupSchema.parse(data);

        const volunteer = await prismaClient.volunteer.create({
            data: {
                fullName: values.fullName,
                mailAddress: values.mailAddress,
                phoneNumber: values.phoneNumber,
                additionalInfo: normalizeOptionalText(values.additionalInfo),
            },
        });

        const token = crypto.randomUUID();

        await prismaClient.volunteerEmailVerificationToken.create({
            data: {
                token,
                expires: new Date(Date.now() + volunteerVerificationTtlMs),
                volunteer: {
                    connect: { int: volunteer.int },
                },
            },
        });

        try {
            await sendVolunteerConfirmationMail(volunteer, token);
        } catch (error) {
            await recordActionError({
                source: 'sendVolunteerConfirmationMail',
                error,
                targetType: 'Volunteer',
                targetId: volunteer.int,
                context: { mailAddress: volunteer.mailAddress },
            });
        }

        revalidatePath('/mithelfen/uebersicht');
    },
    (data) => ({ targetType: 'Volunteer' as const, context: { mailAddress: data.mailAddress } }),
);

export const confirmVolunteerEmail = async (
    token: string,
): Promise<{ success: true; message?: string } | { success: false; message: string }> => {
    try {
        const emailVerification = await prismaClient.volunteerEmailVerificationToken.findFirst({
            where: { token },
            include: { volunteer: true },
        });

        if (!emailVerification) {
            throw new Error('Ungültiger Verifikationstoken.');
        }

        if (emailVerification.volunteer.emailVerified) {
            return { success: true };
        }

        if (emailVerification.expires < new Date()) {
            throw new Error('Die E-Mail-Verifikation ist ausgelaufen.');
        }

        const volunteer = await prismaClient.volunteer.update({
            where: { int: emailVerification.volunteerId },
            data: { emailVerified: new Date() },
        });

        try {
            await sendVolunteerWelcomeMail(volunteer);
        } catch (error) {
            await recordActionError({
                source: 'sendVolunteerWelcomeMail',
                error,
                targetType: 'Volunteer',
                targetId: volunteer.int,
                context: { mailAddress: volunteer.mailAddress },
            });
        }

        after(() => {
            revalidatePath('/mithelfen/uebersicht');
        });

        return { success: true };
    } catch (error) {
        await recordActionError({
            source: 'confirmVolunteerEmail',
            error,
            context: { hasToken: Boolean(token) },
        });

        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred.',
        };
    }
};
