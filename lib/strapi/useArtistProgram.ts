import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useArtistProgram = (
    collectionType: StrapiCollectionType,
    artistId: string
): SWRResponse<StrapiResponse<Array<ProgramItem | FullTimeProgramItem>>, Error> => {

    return useSWR<StrapiResponse<Array<ProgramItem | FullTimeProgramItem>>, Error>(`/api/program/${collectionType}/${artistId}`, fetcher);
};

export default useArtistProgram;
