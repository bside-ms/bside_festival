import type { Zipcode } from '@prisma/client';
import type { ReactElement } from 'react';

interface Props {
    zipcodes: Array<Zipcode>;
}

const ApplicationDetailsZipcodes = ({ zipcodes }: Props): ReactElement | null => {
    if (zipcodes.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="font-display">Wohnorte</div>
            <div className="flex flex-wrap gap-2">
                {zipcodes.map(({ id, code, isInternational }) => (
                    <span key={id} className="rounded bg-gray-400/20 px-2 py-1 text-sm">
                        {isInternational ? 'Land' : 'PLZ'}: {code}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ApplicationDetailsZipcodes;
