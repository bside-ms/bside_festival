import type { ReactElement } from 'react';
import { CodeBlock } from 'lib/editorJs/Block';

interface Props {
    data: CodeBlock['data'];
}

const CodeBlock = ({ data: { code } }: Props): ReactElement => {

    return (
        <div className="bg-gray-200 p-3 rounded max-w-3xl">
            <pre>{code}</pre>
        </div>
    );
};

export default CodeBlock;
