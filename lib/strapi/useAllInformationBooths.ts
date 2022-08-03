import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useInformationBooths = (): SWRResponse<StrapiResponse<Array<InformationBooth>>, Error> => {

    return useSWR<StrapiResponse<Array<InformationBooth>>, Error>('/api/program/informationBooths/all', fetcher);
};

export default useInformationBooths;
