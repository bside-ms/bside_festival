import type { Block } from 'lib/editorJs/Block';

export default interface EditorJsData {
    time: number;
    version: string;
    blocks: Array<Block>;
}
