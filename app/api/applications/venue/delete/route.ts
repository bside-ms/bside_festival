import { Venue } from '@prisma/client';
import prismaClient from 'lib/common/prismaClient';
import getAllVenues from 'lib/participants/getAllVenues';
import { NextResponse } from 'next/server';

export interface DeleteVenueRequest {
    participantId: number;
}

export interface SuccessfulDeleteVenueResponse {
    updatedVenues: Array<Venue>;
}

export const POST = async (request: Request): Promise<NextResponse<SuccessfulDeleteVenueResponse>> => {
    const { participantId } = (await request.json()) as DeleteVenueRequest;

    await prismaClient.venue.deleteMany({ where: { participantId } });

    const updatedVenues = await getAllVenues();

    return NextResponse.json({ updatedVenues });
};
