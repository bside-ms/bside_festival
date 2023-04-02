import type { Participant } from '@prisma/client';
import type { ReactElement } from 'react';
import typeLabels from 'lib/participants/typeLabels';

interface Props {
    applications: Array<Participant>;
}

const ApplicationsOverview = ({ applications }: Props): ReactElement => {

    return (
        <div>
            <div className="text-xl mb-2">Bewerbungen</div>

            <table className="">
                <thead>
                    <tr className="text-left">
                        <th className="px-2 border border-gray-300">Typ</th>
                        <th className="px-2 border border-gray-300">Name</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(({ id, name, type }) => (
                        <tr key={id}>
                            <td className="px-2 border border-gray-300">
                                {typeLabels[type]}
                            </td>
                            <td className="px-2 border border-gray-300">
                                {name}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicationsOverview;
