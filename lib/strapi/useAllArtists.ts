import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type AllArtists from 'lib/strapi/typings/AllArtists';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useAllArtists = (): SWRResponse<StrapiResponse<AllArtists>, Error> => {

    return useSWR<StrapiResponse<AllArtists>, Error>('/api/artists/all', fetcher);
};

export default useAllArtists;
