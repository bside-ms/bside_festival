import { createVolunteerOnboardingMail, volunteerOnboardingMailSubject } from '@/lib/mail/createVolunteerOnboardingMail';
import sendMail from '@/lib/mail/sendMail';
import type { Volunteer } from '@prisma/client';

const sendVolunteerWelcomeMail = async (volunteer: Volunteer): Promise<void> => {
    const { html } = createVolunteerOnboardingMail(volunteer);

    await sendMail(volunteerOnboardingMailSubject, volunteer.mailAddress, html);
};

export default sendVolunteerWelcomeMail;
