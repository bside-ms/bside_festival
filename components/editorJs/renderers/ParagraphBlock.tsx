import type { ReactElement } from 'react';
import TextWithHtml from 'components/editorJs/renderers/TextWithHtml';
import { ParagraphBlock } from 'lib/editorJs/Block';

interface Props {
    data: ParagraphBlock['data'];
}

const ParagraphBlock = ({ data: { text } }: Props): ReactElement | null => {

    if (text === '<br>') {
        // We don't want to render empty paragraphs. Also when the description
        // is left empty, it will still contain one line break.
        return null;
    }

    return <div><TextWithHtml text={text} /></div>;
};

export default ParagraphBlock;
