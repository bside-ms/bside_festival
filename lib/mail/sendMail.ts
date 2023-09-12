import createMailTransport from 'lib/mail/createMailTransport';
import type ConvertedHtml from 'typings/ConvertedHtml';

const fromName = 'B-Side Festival';
const fromMail = 'no-reply@b-side.ms';

const sendMail = async (subject: string, recipient: string, { html, errors }: ConvertedHtml): Promise<void> => {
    try {
        const transport = createMailTransport();

        if (errors !== undefined && errors.length > 0) {
            throw new Error(`Error while rendering mail: ${errors.join(', ')}`);
        }

        const mailOptions = {
            from: `"${fromName}" <${fromMail}>`,
            to: recipient,
            subject,
            html,
        };

        const sentMessageInfo = await transport.sendMail(mailOptions);

        if (sentMessageInfo.accepted.length === 0) {
            throw new Error('Accepted list is empty');
        }
    } catch (error) {
        throw new Error(`Failed to sent mail, ${JSON.stringify(error)}`);
    }
};

export default sendMail;
