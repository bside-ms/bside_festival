import prismaClient from '@/lib/common/prismaClient';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import AllAttendees from '@/typings/AllAttendees';
import type { Attendee } from '@prisma/client';

const getAllAttendees = async (): Promise<Array<AllAttendees>> => {
    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const createSanitizedAttendee = (attendee: Attendee) => ({
        id: attendee.id,
        fullName: attendee.fullName,
        mailAddress: isInDataPrivacyGroup ? attendee.mailAddress : '',
        scheduleEntryId: attendee.scheduleEntryId,
    });

    return (await prismaClient.attendee.findMany()).reduce((currentAttendees, attendee) => {
        const scheduleEntryData = currentAttendees.find(({ scheduleEntryId }) => scheduleEntryId === attendee.scheduleEntryId);

        if (scheduleEntryData === undefined) {
            currentAttendees.push({
                scheduleEntryId: attendee.scheduleEntryId,
                attendees: [createSanitizedAttendee(attendee)],
            });
        } else {
            scheduleEntryData.attendees.push(createSanitizedAttendee(attendee));
        }

        return currentAttendees;
    }, new Array<AllAttendees>());
};

export default getAllAttendees;
