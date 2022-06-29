import useSWR from 'swr';
import type AllApplicationsResponse from 'lib/application-form/AllApplicationsResponse';
import type ApplicationData from 'lib/application-form/ApplicationData';
import fetcher from 'lib/common/fetcher';

const useAllApplications = (): Array<ApplicationData> | null | Error => {

    const { data, error } = useSWR<AllApplicationsResponse, Error>('/api/application/getAll', fetcher);

    if (error !== undefined) {
        return error;
    }

    if (data === undefined) {
        return null;
    }

    if (!data.success) {
        return new Error('Unknown server error, probably authentication problems..');
    }

    return data.applications;
};

export default useAllApplications;
