import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type Artist from 'lib/strapi/typings/Artist';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useArtist = (collectionType: StrapiCollectionType, artistId: string): SWRResponse<StrapiResponse<Array<Artist>>, Error> => {

    return useSWR<StrapiResponse<Array<Artist>>, Error>(`/api/artists/${collectionType}/${artistId}`, fetcher);
};

export default useArtist;
