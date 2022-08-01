import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useAllProgramItems = (): SWRResponse<StrapiResponse<AllProgramItemsResponse>, Error> => {

    return useSWR<StrapiResponse<AllProgramItemsResponse>, Error>('/api/program/all', fetcher);
};

export default useAllProgramItems;
