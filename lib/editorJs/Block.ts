import type BlockType from 'lib/editorJs/BlockType';

interface BaseBlock {
    id: string;
    type: BlockType;
}

export type Block = ParagraphBlock
    | ImageBlock
    | HeaderBlock
    | ListBlock
    | QuoteBlock
    | WarningBlock
    | CodeBlock
    | ChecklistBlock
    | TableBlock
    | RawBlock
    | DelimiterBlock;

export interface ParagraphBlock extends BaseBlock {
    type: BlockType.paragraph;
    data: {
        text: string;
    };
}

export interface ImageBlock extends BaseBlock {
    type: BlockType.image;
    data: {
        caption: string;
        stretched: boolean;
        withBackground: boolean;
        withBorder: boolean;
        file: {
            url: string;
            height: number;
            size: number;
            width: number;
            mime: string;
            alt: string;
            formats: Record<'thumbnail' | 'small' | 'medium' | 'large', {
                url: string;
                height: number;
                width: number;
                size: number;
                ext: string;
                hash: string;
                mime: string;
                name: string;
                path: null;
            }>;
        };
    };
}

export interface HeaderBlock extends BaseBlock {
    type: BlockType.header;
    data: {
        level: 1 | 2 | 3 | 4 | 5 | 6;
        text: string;
    };
}

export interface ListBlock extends BaseBlock {
    type: BlockType.list;
    data: {
        items: Array<string>;
        style: 'ordered' | 'unordered';
    };
}

export interface QuoteBlock extends BaseBlock {
    type: BlockType.quote;
    data: {
        text: string;
        caption: string;
        alignment: 'left' | 'center';
    };
}

export interface WarningBlock extends BaseBlock {
    type: BlockType.warning;
    data: {
        title: string;
        message: string;
    };
}

export interface CodeBlock extends BaseBlock {
    type: BlockType.code;
    data: {
        code: string;
    };
}

export interface ChecklistBlock extends BaseBlock {
    type: BlockType.checklist;
    data: {
        items: Array<{
            checked: boolean;
            text: string;
        }>;
    };
}

export interface TableBlock extends BaseBlock {
    type: BlockType.table;
    data: {
        withHeadings: boolean;
        content: Array<Array<string>>;
    };
}

export interface RawBlock extends BaseBlock {
    type: BlockType.raw;
    data: {
        html: string;
    };
}

export interface DelimiterBlock extends BaseBlock {
    type: BlockType.delimiter;
    data: Record<string, unknown>;
}
