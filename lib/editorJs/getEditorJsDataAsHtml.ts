import BlockType from 'lib/editorJs/BlockType';
import type EditorJsData from 'lib/editorJs/EditorJsData';

const getEditorJsDataAsHtml = (descriptionData: EditorJsData): string => {

    return descriptionData.blocks.reduce<string>(
        (html, block) => {
            if (block.type === BlockType.paragraph) {
                return `${html} ${block.data.text}`;
            }

            return html;
        },
        ''
    );
};

export default getEditorJsDataAsHtml;
