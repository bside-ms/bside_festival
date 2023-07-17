import type { Volunteer } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';

export interface AddVolunteerRequest {
    fullName: string;
    phoneNumber: string;
    mailAddress: string;
    canCook: boolean;
    hasCar: boolean;
    canCarryHeavyStuff: boolean;
    isSocial: boolean;
    canSupportTechnician: boolean;
    canSupportArtist: boolean;
    hasMultipleTalents: boolean;
    canWorkWithChildren: boolean;
    isAvailableOnFriday: boolean;
    isAvailableOnSaturday: boolean;
    isAvailableOnSunday: boolean;
}

interface ErroneousAddVolunteerResponse {
    message: string;
}

export interface SuccessfulAddVolunteerResponse {
    newVolunteer: Volunteer;
}

export default async (
    request: NextApiRequest,
    response: NextApiResponse<SuccessfulAddVolunteerResponse | ErroneousAddVolunteerResponse>
): Promise<void> => {

    const {
        fullName,
        phoneNumber,
        mailAddress,
        canCook,
        hasCar,
        canCarryHeavyStuff,
        isSocial,
        canSupportTechnician,
        canSupportArtist,
        hasMultipleTalents,
        canWorkWithChildren,
        isAvailableOnFriday,
        isAvailableOnSaturday,
        isAvailableOnSunday,
    } = request.body as AddVolunteerRequest;

    const newVolunteer = await prismaClient.volunteer.create({
        data: {
            fullName,
            phoneNumber,
            mailAddress,
            canCook,
            hasCar,
            canCarryHeavyStuff,
            isSocial,
            canSupportTechnician,
            canSupportArtist,
            hasMultipleTalents,
            canWorkWithChildren,
            isAvailableOnFriday,
            isAvailableOnSaturday,
            isAvailableOnSunday,
        },
    });

    response.status(200).json({ newVolunteer });
};
