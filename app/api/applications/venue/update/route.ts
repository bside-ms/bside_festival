import { Venue } from '@prisma/client';
import prismaClient from 'lib/common/prismaClient';
import getAllVenues from 'lib/participants/getAllVenues';
import { NextResponse } from 'next/server';

export interface UpsertVenueRequest {
    participantId: number;
    locationId: number;
    dates: Array<string>;
}

export interface SuccessfulUpdateVenueResponse {
    updatedVenues: Array<Venue>;
}

export const POST = async (request: Request): Promise<NextResponse<SuccessfulUpdateVenueResponse>> => {
    const { participantId, locationId, dates } = (await request.json()) as UpsertVenueRequest;

    // Just deleting venue before creating new one, since upsert only works with unique fields.
    await prismaClient.venue.deleteMany({ where: { participantId } });

    await prismaClient.venue.create({ data: { participantId, locationId, dates: dates.join(',') } });

    const updatedVenues = await getAllVenues();

    return NextResponse.json({ updatedVenues });
};
