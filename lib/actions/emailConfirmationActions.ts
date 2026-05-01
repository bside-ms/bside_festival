'use server';

import prismaClient from '@/lib/common/prismaClient';
import sendApplicationConfirmationMail from '@/lib/mail/sendApplicationConfirmationMail';
import { Participant } from '@prisma/client';

export async function createVerification(participant: Participant) {
    try {
        await prismaClient.emailVerificationToken.deleteMany({
            where: { participantId: participant.id },
        });

        const token = crypto.randomUUID();
        const newVerification = await prismaClient.emailVerificationToken.create({
            data: {
                token: token,
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                participant: {
                    connect: { id: participant.id },
                },
            },
        });

        sendApplicationConfirmationMail(participant, newVerification.token);

        return {
            token: newVerification.token,
        };
    } catch (error) {
        console.error('Verification Error:', error);
        // We throw or return an error object to be caught by the Client Component
        return {
            message: error instanceof Error ? error.message : 'An unexpected error occurred.',
        };
    }
}

export async function checkVerification(token: string) {
    try {
        const emailVerification = await prismaClient.emailVerificationToken.findFirst({
            where: { token },
        });

        if (!emailVerification) {
            throw new Error('Ungültiger Verifikationstoken.');
        }

        if (emailVerification.expires < new Date()) {
            throw new Error('Die Email-Verifikation ist ausgelaufen.');
        }

        const participant = await prismaClient.participant.findUnique({
            where: { id: emailVerification.participantId },
        });

        if (participant?.emailVerified) {
            return { success: true, message: 'E-Mail bereits verifiziert.' };
        }

        await prismaClient.participant.update({
            where: { id: emailVerification.participantId },
            data: { emailVerified: new Date() },
        });

        return { success: true };
    } catch (error) {
        console.error('Verification Error:', error);
        // We throw or return an error object to be caught by the Client Component
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred.',
        };
    }
}
