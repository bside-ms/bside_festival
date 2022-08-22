import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';
import type Volunteer from 'lib/volunteers/Volunteer';

const useAllVolunteers = (): SWRResponse<StrapiResponse<Array<Volunteer>>, Error> => {

    return useSWR<StrapiResponse<Array<Volunteer>>, Error>('/api/volunteers/all', fetcher);
};

export default useAllVolunteers;
