import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type Concert from 'lib/strapi/Concert';
import type StrapiResponse from 'lib/strapi/StrapiResponse';

const useAllConcerts = (): SWRResponse<StrapiResponse<Array<Concert>>, Error> => {

    return useSWR<StrapiResponse<Array<Concert>>, Error>('/api/program/concerts/all', fetcher);
};

export default useAllConcerts;
