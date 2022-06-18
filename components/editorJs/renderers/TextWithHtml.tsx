import type { ReactElement } from 'react';

interface Props {
    text: string;
}

// eslint-disable-next-line react/no-danger
const TextWithHtml = ({ text }: Props): ReactElement => <span dangerouslySetInnerHTML={{ __html: text }} />;

export default TextWithHtml;
