import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useAllLocations = (): SWRResponse<StrapiResponse<Array<LocationGroup>>, Error> => {

    return useSWR<StrapiResponse<Array<LocationGroup>>, Error>('/api/locations/groups', fetcher);
};

export default useAllLocations;
