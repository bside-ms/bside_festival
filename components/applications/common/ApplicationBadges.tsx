import type { ReactElement } from 'react';
import isNotEmptyNumber from 'lib/common/helper/isNotEmptyNumber';
import statusLabels from 'lib/participants/status/statusLabels';
import typeColors from 'lib/participants/typeColors';
import typeLabels from 'lib/participants/typeLabels';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationBadges = ({ application }: Props): ReactElement => {

    const { type, curationScore, status } = application;

    return (
        <div className="flex gap-2 mb-2">
            <div
                className="uppercase inline-block select-none rounded-2xl text-sm px-3 py-1"
                style={{ backgroundColor: typeColors[type] }}
            >
                {typeLabels[type]}
            </div>

            {isNotEmptyNumber(curationScore) && (
                <div className="rounded-2xl text-sm px-3 py-1 bg-gray-800 text-white">
                    {curationScore}
                </div>
            )}

            <div
                className="uppercase inline-block select-none rounded-2xl text-sm px-3 py-1 bg-gray-800 text-white"
            >
                {statusLabels[status]}
            </div>
        </div>
    );
};

export default ApplicationBadges;
