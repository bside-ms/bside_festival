import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type ConcertArtist from 'lib/strapi/typings/ConcertArtist';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useAllConcertArtists = (): SWRResponse<StrapiResponse<Array<ConcertArtist>>, Error> => {

    return useSWR<StrapiResponse<Array<ConcertArtist>>, Error>('/api/concert-artists/all', fetcher);
};

export default useAllConcertArtists;
