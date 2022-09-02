import type { ReactElement } from 'react';
import TextWithHtml from 'components/editorJs/renderers/TextWithHtml';
import { ParagraphBlock } from 'lib/editorJs/Block';

interface Props {
    data: ParagraphBlock['data'];
}

const ParagraphBlock = ({ data: { text } }: Props): ReactElement | null => {

    if (['<br>', '.<br>', '.'].includes(text.trim())) {
        // We don't want to render empty paragraphs or just dots. Also when the description
        // is left empty, it will still contain one line break.
        return null;
    }

    return <div><TextWithHtml text={text} /></div>;
};

export default ParagraphBlock;
