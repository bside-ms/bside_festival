import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type Registration from 'lib/registrations/Registration';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useAllRegistrations = (): SWRResponse<StrapiResponse<Array<Registration>>, Error> => {

    return useSWR<StrapiResponse<Array<Registration>>, Error>('/api/registrations/all', fetcher);
};

export default useAllRegistrations;
