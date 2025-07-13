import prismaClient from '@/lib/common/prismaClient';
import type { Venue } from '@prisma/client';

const getAllVenues = async (): Promise<Array<Venue>> => {
    return prismaClient.venue.findMany();
};

export default getAllVenues;
