import { parseJuryVotes } from '@/lib/applications/curationScoring';
import type { ParticipantWithInternRelations } from '@/lib/participants/getAllParticipants';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';

const serializeParticipant = (application: ParticipantWithInternRelations): SerializableParticipant => ({
    ...application,
    appliedAt: application.appliedAt?.toString() ?? null,
    comments: application.comments.map((comment) => ({ ...comment, createdAt: comment.createdAt.toISOString() })),
    emailVerified: application.emailVerified?.toString() ?? null,
    hasParticipatedBefore: application.hasParticipatedBefore ?? null,
    juryVotes: parseJuryVotes(application.juryVotes),
    organizers: application.organizers.map(({ organizerName, organizerUserId }) => ({ organizerName, organizerUserId })),
    updatedAt: application.updatedAt.toString(),
});

export default serializeParticipant;
