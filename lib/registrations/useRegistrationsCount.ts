import useSWR from 'swr';
import type { SWRResponse } from 'swr/dist/types';
import fetcher from 'lib/common/fetcher';
import type RegistrationsCount from 'lib/registrations/RegistrationsCount';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const useRegistrationsCount = (
    collectionType: StrapiCollectionType,
    programId: number
): SWRResponse<StrapiResponse<RegistrationsCount>, Error> => {

    return useSWR<StrapiResponse<RegistrationsCount>, Error>(`/api/registrations/${collectionType}/${programId}/count`, fetcher);
};

export default useRegistrationsCount;
