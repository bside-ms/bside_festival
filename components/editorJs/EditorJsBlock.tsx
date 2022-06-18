import type { ReactElement } from 'react';
import ChecklistBlock from 'components/editorJs/renderers/ChecklistBlock';
import CodeBlock from 'components/editorJs/renderers/CodeBlock';
import DelimiterBlock from 'components/editorJs/renderers/DelimiterBlock';
import HeaderBlock from 'components/editorJs/renderers/HeaderBlock';
import ImageBlock from 'components/editorJs/renderers/ImageBlock';
import ListBlock from 'components/editorJs/renderers/ListBlock';
import ParagraphBlock from 'components/editorJs/renderers/ParagraphBlock';
import QuoteBlock from 'components/editorJs/renderers/QuoteBlock';
import RawBlock from 'components/editorJs/renderers/RawBlock';
import TableBlock from 'components/editorJs/renderers/TableBlock';
import WarningBlock from 'components/editorJs/renderers/WarningBlock';
import type { Block } from 'lib/editorJs/Block';
import BlockType from 'lib/editorJs/BlockType';

interface Props {
    block: Block;
}

const EditorJsBlock = ({ block }: Props): ReactElement => {

    switch (block.type) {
        case BlockType.checklist:
            return <ChecklistBlock data={block.data} />;

        case BlockType.code:
            return <CodeBlock data={block.data} />;

        case BlockType.delimiter:
            return <DelimiterBlock />;

        case BlockType.header:
            return <HeaderBlock data={block.data} />;

        case BlockType.image:
            return <ImageBlock data={block.data} />;

        case BlockType.list:
            return <ListBlock data={block.data} />;

        case BlockType.paragraph:
            return <ParagraphBlock data={block.data} />;

        case BlockType.quote:
            return <QuoteBlock data={block.data} />;

        case BlockType.raw:
            return <RawBlock data={block.data} />;

        case BlockType.table:
            return <TableBlock data={block.data} />;

        case BlockType.warning:
            return <WarningBlock data={block.data} />;
    }
};

export default EditorJsBlock;
