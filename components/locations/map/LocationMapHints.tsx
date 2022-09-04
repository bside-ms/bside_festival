import { Alert } from '@mui/material';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import isGroupMember from 'lib/next-auth/isGroupMember';

interface Props {
    coordinateLookUpHints: Array<string>;
}

const LocationMapHints = ({ coordinateLookUpHints }: Props): ReactElement | null => {

    const { data: session } = useSession();
    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    if (!isInFestivalGroup) {
        return null;
    }

    if (coordinateLookUpHints.length === 0) {
        return null;
    }

    return (
        <div className="mt-3 space-y-3">
            {coordinateLookUpHints.map(hint => (
                <Alert key={hint} severity="info">
                    {hint}
                </Alert>
            ))}
        </div>
    );
};

export default LocationMapHints;
