import { render } from '@faire/mjml-react/utils/render';
import type { Participant } from '@prisma/client';
import ApplicationConfirmationMail from 'components/mail/ApplicationConfirmationMail';
import sendMail from 'lib/mail/sendMail';

const sendApplicationConfirmationMail = (application: Omit<Participant, 'contactMail'> & { contactMail: string }, links: Array<string>): void => {

    const title = 'B-Side Festival 2023 - Bewerbungsbestätigung';

    sendMail(
        title,
        application.contactMail,
        render(<ApplicationConfirmationMail title={title} application={application} links={links} />)
    );
};

export default sendApplicationConfirmationMail;
