import type { ReactElement } from 'react';
import TextWithHtml from 'components/editorJs/renderers/TextWithHtml';
import { QuoteBlock } from 'lib/editorJs/Block';

interface Props {
    data: QuoteBlock['data'];
}

const QuoteBlock = ({ data: { text, caption } }: Props): ReactElement => {

    return (
        <div>
            <blockquote className="border-l-2 border-gray-500 pl-3">
                <TextWithHtml text={text} />
            </blockquote>
            <div className="italic"><TextWithHtml text={caption} /></div>
        </div>
    );
};

export default QuoteBlock;
