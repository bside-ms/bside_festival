import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';
import { Venue } from '@prisma/client';
import getAllVenues from 'lib/participants/getAllVenues';

export interface UpsertVenueRequest {
    participantId: number;
    locationId: number;
    dates: Array<string>;
}

export interface SuccessfulUpdateVenueResponse {
    updatedVenues: Array<Venue>;
}

export default async (request: NextApiRequest, response: NextApiResponse<SuccessfulUpdateVenueResponse>): Promise<void> => {
    const { participantId, locationId, dates } = request.body as UpsertVenueRequest;

    // Just deleting venue before creating new one, since upsert only works with unique fields.
    await prismaClient.venue.deleteMany({ where: { participantId } });

    await prismaClient.venue.create({ data: { participantId, locationId, dates: dates.join(',') } });

    const updatedVenues = await getAllVenues();

    response.status(200).json({ updatedVenues });
};
