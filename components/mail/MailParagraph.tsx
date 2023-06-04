import { MjmlText } from '@faire/mjml-react';
import type { PropsWithChildren, ReactElement } from 'react';

const MailParagraph = ({ children }: PropsWithChildren): ReactElement => (
    <MjmlText color="#374151" fontSize="14px" lineHeight="1.4">
        {children}
    </MjmlText>
);

export default MailParagraph;
