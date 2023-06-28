import type { Participant } from '@prisma/client';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

const serializeApplication = (application: Participant): SerializableParticipant => ({
    ...application,
    appliedAt: application.appliedAt?.toString() ?? null,
    updatedAt: application.updatedAt.toString(),
});

export default serializeApplication;
