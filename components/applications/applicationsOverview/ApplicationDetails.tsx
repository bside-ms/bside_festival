import type { Participant } from '@prisma/client';
import type { ReactElement } from 'react';
import typeLabels from 'lib/participants/typeLabels';

interface Props {
    application: Participant;
}

const ApplicationDetails = ({ application: { id, name, type, description } }: Props): ReactElement => {

    const imageUrl = `https://picsum.photos/seed/${id}/400/200`;

    return (
        <div className="p-3 rounded-md shadow-lg relative text-gray-800">
            <div
                className="w-full h-32 md:h-52 relative rounded-md overflow-hidden mb-2"
            >
                <div
                    className="bg-center bg-cover bg-no-repeat absolute top-0 right-0 bottom-0 left-0"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div
                    className="bg-center bg-contain backdrop-blur-2xl bg-no-repeat absolute top-0 right-0 bottom-0 left-0"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            </div>

            <div className="uppercase text-sm text-gray-600">{typeLabels[type]}</div>

            <div className="text-xl">{name}</div>

            <div>{description}</div>
        </div>
    );
};

export default ApplicationDetails;
