import { parseJuryVotes } from '@/lib/applications/curationScoring';
import type { ParticipantWithInternRelations } from '@/lib/participants/getAllParticipants';
import type { ListParticipantEarliestSlot, SerializableListParticipant } from '@/typings/SerializableListParticipant';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { first } from 'lodash';

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
export const serializeListParticipant = (
    application: ParticipantWithInternRelations,
    earliestSlot: ListParticipantEarliestSlot | null,
): SerializableListParticipant => {
    const lastComment = first(application.comments);

    return {
        contactName: application.contactName,
        earliestSlot,
        feeEuros: application.feeEuros,
        id: application.id,
        lastComment:
            lastComment === undefined
                ? null
                : {
                      authorName: lastComment.authorName,
                      createdAt: lastComment.createdAt.toISOString(),
                      text: lastComment.text,
                  },
        name: application.name,
        organizers: application.organizers.map(({ organizerName, organizerUserId }) => ({ organizerName, organizerUserId })),
        status: application.status,
        type: application.type,
        updatedAt: application.updatedAt.toISOString(),
    };
};

export default serializeParticipant;
