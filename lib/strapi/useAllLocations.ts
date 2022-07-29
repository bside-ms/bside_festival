import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type Location from 'lib/strapi/typings/Location';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useAllLocations = (): SWRResponse<StrapiResponse<Array<Location>>, Error> => {

    return useSWR<StrapiResponse<Array<Location>>, Error>('/api/locations/all', fetcher);
};

export default useAllLocations;
