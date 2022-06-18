import type { ReactElement } from 'react';
import TextWithHtml from 'components/editorJs/renderers/TextWithHtml';
import { ParagraphBlock } from 'lib/editorJs/Block';

interface Props {
    data: ParagraphBlock['data'];
}

const ParagraphBlock = ({ data: { text } }: Props): ReactElement => {

    return <div><TextWithHtml text={text} /></div>;
};

export default ParagraphBlock;
