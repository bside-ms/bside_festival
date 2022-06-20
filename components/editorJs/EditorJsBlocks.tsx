import type { ReactElement } from 'react';
import EditorJsBlock from 'components/editorJs/EditorJsBlock';
import type { Block } from 'lib/editorJs/Block';

interface Props {
    blocks: Array<Block>;
}

const EditorJsBlocks = ({ blocks }: Props): ReactElement => {

    return (
        <div className="space-y-2">
            {blocks.map(block => (
                <EditorJsBlock
                    key={block.id}
                    block={block}
                />
            ))}
        </div>
    );
};

export default EditorJsBlocks;
