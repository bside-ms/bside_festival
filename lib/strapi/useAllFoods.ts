import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type Food from 'lib/strapi/typings/Food';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useAllFoods = (): SWRResponse<StrapiResponse<Array<Food>>, Error> => {

    return useSWR<StrapiResponse<Array<Food>>, Error>('/api/program/foods/all', fetcher);
};

export default useAllFoods;
