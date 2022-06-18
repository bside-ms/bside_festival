import type { ReactElement } from 'react';
import { HeaderBlock } from 'lib/editorJs/Block';

interface Props {
    data: HeaderBlock['data'];
}

const HeaderBlock = ({ data: { level, text } }: Props): ReactElement => {

    switch (level) {
        case 1:
            return <h1 className="text-5xl">{text}</h1>;
        case 2:
            return <h2 className="text-4xl">{text}</h2>;
        case 3:
            return <h3 className="text-3xl">{text}</h3>;
        case 4:
            return <h4 className="text-2xl">{text}</h4>;
        case 5:
            return <h5 className="text-xl">{text}</h5>;
        case 6:
            return <h6 className="font-bold">{text}</h6>;
    }
};

export default HeaderBlock;
