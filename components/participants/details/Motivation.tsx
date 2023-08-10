import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const Motivation = ({ application: { motivation } }: Props): ReactElement | null => {

    if (isEmptyString(motivation)) {
        return null;
    }

    return (
        <>
            <div className="font-display">Motivation</div>
            <div>{motivation}</div>
        </>
    );
};

export default Motivation;
