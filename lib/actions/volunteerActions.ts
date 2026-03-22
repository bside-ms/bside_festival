'use server';

import prismaClient from '@/lib/common/prismaClient';
import { revalidatePath } from 'next/cache';

export interface AddVolunteerData {
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
    isAvailableBefore: boolean;
    additionalInfo: string;
}

export const addVolunteer = async (data: AddVolunteerData): Promise<void> => {
    await prismaClient.volunteer.create({ data });
    revalidatePath('/mithelfen/uebersicht');
};
