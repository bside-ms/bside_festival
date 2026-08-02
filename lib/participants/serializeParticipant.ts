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

/** Slim payload for the Programmbeiträge list — only fields the list UI/search needs. */
export const serializeListParticipant = (application: ParticipantWithInternRelations): SerializableParticipant =>
    ({
        id: application.id,
        name: application.name,
        type: application.type,
        status: application.status,
        appliedAt: application.appliedAt?.toString() ?? null,
        updatedAt: application.updatedAt.toString(),
        description: application.description,
        contactName: application.contactName,
        organizers: application.organizers.map(({ organizerName, organizerUserId }) => ({ organizerName, organizerUserId })),
        comments: [],
    }) as unknown as SerializableParticipant;

export default serializeParticipant;
