import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';
import type Workshop from 'lib/strapi/typings/Workshop';

const useAllConcerts = (): SWRResponse<StrapiResponse<Array<Workshop>>, Error> => {

    return useSWR<StrapiResponse<Array<Workshop>>, Error>('/api/program/workshops/all', fetcher);
};

export default useAllConcerts;
