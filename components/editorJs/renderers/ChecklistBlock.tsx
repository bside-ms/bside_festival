import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import TextWithHtml from 'components/editorJs/renderers/TextWithHtml';
import { ChecklistBlock } from 'lib/editorJs/Block';

interface Props {
    data: ChecklistBlock['data'];
}

const ChecklistBlock = ({ data: { items } }: Props): ReactElement => {

    return (
        <div>
            {items.map(({ text, checked }) => {

                const icon = checked ? faCheckCircle : faCircle;

                return (
                    <div key={text} className="flex px-3">
                        <div className="basis-7 shrink-0">
                            <FontAwesomeIcon icon={icon} />
                        </div>

                        <div>
                            <TextWithHtml text={text} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistBlock;
