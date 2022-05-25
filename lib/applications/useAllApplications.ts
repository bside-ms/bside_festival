import type AllApplicationsResponse from 'lib/application-form/AllApplicationsResponse';
import type ApplicationData from 'lib/application-form/ApplicationData';
import fetcher from 'lib/common/fetcher';
import useSWR from 'swr';

const useAllApplications = (): Array<ApplicationData> | null | Error => {

    const { data, error } = useSWR<AllApplicationsResponse, Error>('/api/application/getAll', fetcher);

    if (error !== undefined) {
        return error;
    }

    if (data === undefined || !data.success) {
        return null;
    }

    return data.applications;
};

export default useAllApplications;
