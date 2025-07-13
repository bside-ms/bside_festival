import prismaClient from '@/lib/common/prismaClient';
import type { Volunteer } from '@prisma/client';
import { NextResponse } from 'next/server';

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
    additionalInfo: string;
}

interface ErroneousAddVolunteerResponse {
    message: string;
}

export interface SuccessfulAddVolunteerResponse {
    newVolunteer: Volunteer;
}

export const POST = async (request: Request): Promise<NextResponse<SuccessfulAddVolunteerResponse | ErroneousAddVolunteerResponse>> => {
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
        additionalInfo,
    } = (await request.json()) as AddVolunteerRequest;

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
            additionalInfo,
        },
    });

    return NextResponse.json({ newVolunteer });
};
