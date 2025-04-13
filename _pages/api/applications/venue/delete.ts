import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';
import getAllVenues from 'lib/participants/getAllVenues';
import { Venue } from '@prisma/client';

export interface DeleteVenueRequest {
    participantId: number;
}

export interface SuccessfulDeleteVenueResponse {
    updatedVenues: Array<Venue>;
}

export default async (request: NextApiRequest, response: NextApiResponse<SuccessfulDeleteVenueResponse>): Promise<void> => {
    const { participantId } = request.body as DeleteVenueRequest;

    await prismaClient.venue.deleteMany({ where: { participantId } });

    const updatedVenues = await getAllVenues();

    response.status(200).json({ updatedVenues: updatedVenues });
};
