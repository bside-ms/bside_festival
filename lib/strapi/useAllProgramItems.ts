import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useAllProgramItems = (): SWRResponse<StrapiResponse<AllProgramItems>, Error> => {

    return useSWR<StrapiResponse<AllProgramItems>, Error>('/api/program/all', fetcher);
};

export default useAllProgramItems;
