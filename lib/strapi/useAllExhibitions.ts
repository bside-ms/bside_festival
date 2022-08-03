import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useAllExhibitions = (): SWRResponse<StrapiResponse<Array<Exhibition>>, Error> => {

    return useSWR<StrapiResponse<Array<Exhibition>>, Error>('/api/program/exhibitions/all', fetcher);
};

export default useAllExhibitions;
