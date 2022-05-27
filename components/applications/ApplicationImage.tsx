import type { ReactElement } from 'react';
import useSWR from 'swr';
import type ApplicationResponse from 'lib/application-form/ApplicationResponse';
import fetcher from 'lib/common/fetcher';

interface Props {
    applicationId: number;
}

const ApplicationImage = ({ applicationId }: Props): ReactElement | null => {

    const { data, error } = useSWR<ApplicationResponse, Error>(`/api/application/${applicationId}`, fetcher);

    if (error !== undefined) {
        return null;
    }

    if (data === undefined || !data.success) {
        return <div>Foto lädt...</div>;
    }

    if (!('photo' in data.application.data)) {
        return <div>Kein Foto verfügbar</div>;
    }

    return (
        <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.application.data.photo} />
        </div>
    );
};

export default ApplicationImage;
