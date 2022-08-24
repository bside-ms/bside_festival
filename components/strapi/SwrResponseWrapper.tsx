import { Alert, AlertTitle } from '@mui/material';
import type { ReactElement } from 'react';
import type { SWRResponse } from 'swr/dist/types';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

interface Props<T> {
    response: SWRResponse<StrapiResponse<T>, Error>;
    children: (response: T) => ReactElement;
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
const SwrResponseWrapper = <T, >({ response: { data, error }, children }: Props<T>): ReactElement => {

    if (error !== undefined) {
        return (
            <Alert severity="error">
                <AlertTitle>Es ist ein Fehler aufgetreten</AlertTitle>
                {error.message}
            </Alert>
        );
    }

    if (data === undefined) {
        return (
            <div>Wird geladen...</div>
        );
    }

    if ('error' in data) {
        if (typeof data.error === 'string') {
            return (
                <Alert severity="error">
                    <AlertTitle>Es ist ein Fehler aufgetreten</AlertTitle>
                    {data.error}
                </Alert>
            );
        }

        return (
            <Alert severity="error">
                <AlertTitle>{data.error.name} ({data.error.status})</AlertTitle>
                {data.error.message}
            </Alert>
        );
    }

    return children(data.data);
};

export default SwrResponseWrapper;
