import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type AllFullTimeProgramItemsResponse from 'lib/strapi/typings/AllFullTimeProgramItemsResponse';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useAllFullTimeProgramItems = (): SWRResponse<StrapiResponse<AllFullTimeProgramItemsResponse>, Error> => {

    return useSWR<StrapiResponse<AllFullTimeProgramItemsResponse>, Error>('/api/program/full-time/all', fetcher);
};

export default useAllFullTimeProgramItems;
