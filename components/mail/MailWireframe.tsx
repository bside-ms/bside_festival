import { Mjml, MjmlBody, MjmlColumn, MjmlDivider, MjmlFont, MjmlHead, MjmlPreview, MjmlSection, MjmlText, MjmlTitle } from '@faire/mjml-react';
import type { PropsWithChildren, ReactElement } from 'react';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';

interface Props extends PropsWithChildren {
    title: string;
    preview?: string;
}

const MailWireframe = ({ title, preview, children }: Props): ReactElement => {

    return (
        <Mjml>
            <MjmlHead>
                <MjmlTitle>{title}</MjmlTitle>

                {isNotEmptyString(preview) && <MjmlPreview>{preview}</MjmlPreview>}

                <MjmlFont name={'"Ubuntu", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'} />
            </MjmlHead>
            <MjmlBody>
                <MjmlSection fullWidth={true} backgroundColor="#818387">
                    <MjmlColumn padding={0} width="600px">
                        <MjmlText color="#ededed" fontWeight="700" fontSize="20px" align="left">
                            B-Side Festival 2023
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>

                <MjmlSection fullWidth={true} backgroundColor="#f57773" paddingLeft="15px" paddingRight="15px">
                    <MjmlColumn width="600px" paddingTop="20px" paddingBottom="20px" backgroundColor="#e9e9e9" borderRadius="4px">

                        {children}

                        <MjmlDivider borderColor="#374151" borderWidth="1px" />

                        <MjmlText color="#4d5c6b" fontSize="12px">
                            Diese E-Mail wurde automatisch generiert, bitte antworten Sie nicht auf
                            sie. Verwende dafür stattdessen festival@b-side.ms.
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlBody>
        </Mjml>
    );
};

export default MailWireframe;
