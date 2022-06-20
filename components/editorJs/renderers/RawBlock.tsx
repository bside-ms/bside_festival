import type { ReactElement } from 'react';
import { RawBlock } from 'lib/editorJs/Block';

interface Props {
    data: RawBlock['data'];
}

const RawBlock = ({ data: { html } }: Props): ReactElement => {

    return (
        <div className="bg-gray-200 p-3 rounded max-w-3xl">
            <pre>{html}</pre>
        </div>
    );
};

export default RawBlock;
