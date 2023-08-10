import type { Participant } from '@prisma/client';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

const serializeParticipant = (application: Participant): SerializableParticipant => ({
    ...application,
    appliedAt: application.appliedAt?.toString() ?? null,
    updatedAt: application.updatedAt.toString(),
});

export default serializeParticipant;
