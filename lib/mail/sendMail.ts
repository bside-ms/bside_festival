import createMailTransport from '@/lib/mail/createMailTransport';

const fromName = 'B-Side Festival';
const fromMail = 'no-reply@b-side.ms';

const sendMail = async (subject: string, recipient: string, html: string): Promise<void> => {
    try {
        const sentMessageInfo = await createMailTransport().sendMail({
            from: `"${fromName}" <${fromMail}>`,
            to: recipient,
            subject,
            html,
        });

        if (sentMessageInfo.accepted.length === 0) {
            throw new Error('Accepted list is empty');
        }
    } catch (error) {
        throw new Error(`Failed to sent mail, ${JSON.stringify(error)}`);
    }
};

export default sendMail;
