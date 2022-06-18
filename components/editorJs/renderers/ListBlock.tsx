import type { ReactElement } from 'react';
import TextWithHtml from 'components/editorJs/renderers/TextWithHtml';
import { ListBlock } from 'lib/editorJs/Block';

interface Props {
    data: ListBlock['data'];
}

const ListBlock = ({ data: { style, items } }: Props): ReactElement => {

    const renderedItems = items.map(item => <li key={item}><TextWithHtml text={item} /></li>);

    if (style === 'ordered') {
        return (
            <ol className="list-decimal list-inside">
                {renderedItems}
            </ol>
        );
    }

    return (
        <ul className="list-disc list-inside">
            {renderedItems}
        </ul>
    );
};

export default ListBlock;
