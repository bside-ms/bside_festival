import { Alert } from '@mui/material';
import type { ReactElement } from 'react';

interface Props {
    coordinateLookUpHints: Array<string>;
}

const LocationMapHints = ({ coordinateLookUpHints }: Props): ReactElement | null => {

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
