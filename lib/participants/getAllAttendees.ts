import type { Attendee } from '@prisma/client';
import prismaClient from 'lib/common/prismaClient';
import getUserSession from 'lib/next-auth/getUserSession';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';
import AllAttendees from 'typings/AllAttendees';

const getAllAttendees = async (): Promise<Array<AllAttendees>> => {
    const userSession = await getUserSession();
    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const createSanitizedAttendee = (attendee: Attendee) => ({
        id: attendee.id,
        fullName: userSession !== null ? (Math.random() > 0.5 ? 'Jane Doe' : 'John Doe') : attendee.fullName,
        mailAddress: isInDataPrivacyGroup ? attendee.mailAddress : '',
        slotId: attendee.slotId,
    });

    return (await prismaClient.attendee.findMany()).reduce((currentAttendees, attendee) => {
        const slotData = currentAttendees.find(({ slotId }) => slotId === attendee.slotId);

        if (slotData === undefined) {
            currentAttendees.push({
                slotId: attendee.slotId,
                attendees: [createSanitizedAttendee(attendee)],
            });
        } else {
            slotData.attendees.push(createSanitizedAttendee(attendee));
        }

        return currentAttendees;
    }, new Array<AllAttendees>());
};

export default getAllAttendees;
