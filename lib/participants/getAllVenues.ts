import type { Venue } from '@prisma/client';
import prismaClient from 'lib/common/prismaClient';

const getAllVenues = async (): Promise<Array<Venue>> => {
    return prismaClient.venue.findMany();
};

export default getAllVenues;
