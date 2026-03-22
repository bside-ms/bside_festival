'use server'

import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import prismaClient from '@/lib/common/prismaClient';
import sendApplicationConfirmationMail from '@/lib/mail/sendApplicationConfirmationMail';
import allowedImageContentTypes from '@/lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from '@/lib/upload/allowedImageMaxFileSize';
import allowedTechnicRiderContentType from '@/lib/upload/allowedTechnicRiderContentType';
import allowedTechnicalRiderMaxFileSize from '@/lib/upload/allowedTechnicalRiderMaxFileSize';
import uploadFileToIonos from '@/lib/upload/uploadFileToIonos';
import { Type } from '@prisma/client';
import { ApplicationFormValues } from '@/components/applications/applicationForm/ApplicationForm';

export async function submitApplicationAction(values: ApplicationFormValues, chosenType: Type) {
    try {
        // 1. Handle File Uploads (Ionos)
        const imageFileName = await uploadFileToIonos(
            values.encodedImage, 
            allowedImageContentTypes, 
            allowedImageMaxFileSize
        );

        const technicalRiderFileName = values.encodedTechnicalRiderPdf 
            ? await uploadFileToIonos(
                values.encodedTechnicalRiderPdf,
                [allowedTechnicRiderContentType],
                allowedTechnicalRiderMaxFileSize,
              )
            : null;

        const publicLinks = values.publicLinks
            .map(l => l.url)
            .filter(url => url.trim() !== "");
            
        const privateLinks = values.privateLinks
            .map(l => l.url)
            .filter(url => url.trim() !== "");

        // 3. Database Transaction with Prisma
        const newParticipant = await prismaClient.participant.create({
            data: {
                type: chosenType,
                name: values.name,
                contactName: values.contactName,
                contactPhone: values.contactPhone,
                contactMail: values.contactMail,
                technicalRider: values.technicalRider ?? null,
                description: values.description,
                motivation: values.motivation,
                residence: values.residence ?? null,
                additionalInfo: values.additionalInfo,
                imageFileName,
                technicalRiderFileName,
                backlineSharing: values.backlineSharing ?? null,
                materialExpenses: values.materialExpenses ?? null,
                participantCount: values.participantCount,
                flintaParticipantsCount: values.flintaParticipantsCount,
                hasMarginalizedParticipants: values.hasMarginalizedParticipants,
                professionalParticipantsCount: values.professionalParticipantsCount,
                diversityNotes: values.diversityNotes,
                allergies: values.allergies,

                // Nested Genre Creation
                genres: {
                    create: [
                        ...(values.concertGenres ?? []).map((genre) => 
                            typeof genre === 'number' 
                                ? { genre: { connect: { id: genre } } } 
                                : { genre: { create: { type: Type.Concert, name: genre } } }
                        ),
                        ...(values.diskJockeyGenres ?? []).map((genre) => 
                            typeof genre === 'number' 
                                ? { genre: { connect: { id: genre } } } 
                                : { genre: { create: { type: Type.DiskJockey, name: genre } } }
                        ),
                    ],
                },
                links: {
                    create: [
                        ...publicLinks.map(link => ({ link, isConfidential: false })),
                        ...privateLinks.map(link => ({ link, isConfidential: true }))
                    ]
                },
                appliedAt: new Date(),
            },
        });

        // 4. Send Confirmation Email
        if (isNotEmptyString(newParticipant.contactMail)) {
            // We pass the filtered links so they appear in the email
            await sendApplicationConfirmationMail(
                {
                    ...newParticipant,
                    contactMail: newParticipant.contactMail,
                },
                publicLinks, privateLinks
            );
        }

        return { success: true };

    } catch (error) {
        console.error("Submission Error:", error);
        // We throw or return an error object to be caught by the Client Component
        return { 
            success: false, 
            message: error instanceof Error ? error.message : "An unexpected error occurred." 
        };
    }
}