import { Alert, AlertTitle } from '@mui/material';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import ConcertArtist from 'components/concert-artists/ConcertArtist';
import type { default as ConcertArtistModel } from 'lib/strapi/ConcertArtist';
import type StrapiResponse from 'lib/strapi/StrapiResponse';

interface Props {
    data?: StrapiResponse<Array<ConcertArtistModel>>;
    error?: Error;
}

const ConcertArtistsList = ({ data, error }: Props): ReactElement => {

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

    const allConcertArtists = data.data;

    return (
        <div className="my-8">
            <ContentWrapper>
                <div className="space-y-5">
                    {allConcertArtists.map(concertArtist => (
                        <ConcertArtist key={concertArtist.id} concertArtist={concertArtist} />
                    ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default ConcertArtistsList;
