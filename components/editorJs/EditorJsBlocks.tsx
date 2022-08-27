import type { ReactElement } from 'react';
import TruncateMarkup from 'react-truncate-markup';
import EditorJsBlock from 'components/editorJs/EditorJsBlock';
import type { Block } from 'lib/editorJs/Block';

interface Props {
    blocks: Array<Block>;
}

const EditorJsBlocks = ({ blocks }: Props): ReactElement => {

    return (
        <div className="space-y-2">
            {blocks.map(block => (
                <TruncateMarkup.Atom key={block.id}>
                    <EditorJsBlock block={block} />
                </TruncateMarkup.Atom>
            ))}
        </div>
    );
};

export default EditorJsBlocks;
