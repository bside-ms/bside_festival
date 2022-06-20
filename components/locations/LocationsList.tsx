import { Alert, AlertTitle } from '@mui/material';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import Location from 'components/locations/Location';
import type { default as LocationModel } from 'lib/strapi/Location';
import type StrapiResponse from 'lib/strapi/StrapiResponse';

interface Props {
    data?: StrapiResponse<Array<LocationModel>>;
    error?: Error;
}

const LocationsList = ({ data, error }: Props): ReactElement => {

    if (error !== undefined) {
        return (
            <div className="my-8">
                <ContentWrapper>
                    <Alert severity="error">
                        <AlertTitle>Es ist ein Fehler aufgetreten</AlertTitle>
                        {error.message}
                    </Alert>
                </ContentWrapper>
            </div>
        );
    }

    if (data === undefined) {
        return (
            <div className="my-8">
                <ContentWrapper>
                    <div>Wird geladen...</div>
                </ContentWrapper>
            </div>
        );
    }

    if ('error' in data) {
        return (
            <div className="my-8">
                <ContentWrapper>
                    <Alert severity="error">
                        <AlertTitle>{data.error.name} ({data.error.status})</AlertTitle>
                        {data.error.message}
                    </Alert>
                </ContentWrapper>
            </div>
        );
    }

    const allLocations = data.data;

    return (
        <div className="my-8">
            <ContentWrapper>
                <div className="space-y-5">
                    {allLocations.map(concertArtist => (
                        <Location key={concertArtist.id} location={concertArtist} />
                    ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default LocationsList;
