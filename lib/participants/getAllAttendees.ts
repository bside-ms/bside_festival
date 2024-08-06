import prismaClient from 'lib/common/prismaClient';
import type { Attendee } from '@prisma/client';
import AllAttendees from 'typings/AllAttendees';

const getAllAttendees = async (isLoggedIn: boolean, isInDataPrivacyGroup: boolean): Promise<Array<AllAttendees>> => {
    const createSanitizedAttendee = (attendee: Attendee) => ({
        id: attendee.id,
        fullName: isLoggedIn ? attendee.fullName : Math.random() > 0.5 ? 'Jane Doe' : 'John Doe',
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
