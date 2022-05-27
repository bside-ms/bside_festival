import { useCallback } from 'react';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement, SyntheticEvent } from 'react';
import useSWR from 'swr';
import ApplicationDetailsImage from 'components/applications/ApplicationDetailsImage';
import ApplicationDetailsPdfDownload from 'components/applications/ApplicationDetailsPdfDownload';
import ApplicationDetailsText from 'components/applications/ApplicationDetailsText';
import ApplicationFormFieldType from 'lib/application-form/ApplicationFormFieldType';
import type ApplicationResponse from 'lib/application-form/ApplicationResponse';
import type ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationDetails from 'lib/applications/useApplicationDetails';
import fetcher from 'lib/common/fetcher';

interface Props {
    id: number;
    type: ApplicationType;
    data: Record<string, string>;
    onCollapse: () => void;
}

const ApplicationDetails = ({ id, type, data, onCollapse }: Props): ReactElement => {

    const { data: fetchData, error } = useSWR<ApplicationResponse, Error>(`/api/application/${id}`, fetcher);

    const usedData = error !== undefined || fetchData === undefined || !fetchData.success ? data : fetchData.application.data;

    const [title, ...applicationDetails] = useApplicationDetails(type, usedData);

    const handleCollapse = useCallback((event: SyntheticEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onCollapse();
    }, [onCollapse]);

    return (
        <div className="space-y-2 overflow-hidden">
            <div className="font-bold">
                {title.value}
            </div>

            {applicationDetails.map(detail => {

                switch (detail.type) {
                    case ApplicationFormFieldType.text:
                    case ApplicationFormFieldType.textArea:
                        return (
                            <ApplicationDetailsText key={detail.name} data={detail} />
                        );

                    case ApplicationFormFieldType.imageUpload:
                        return (
                            <ApplicationDetailsImage key={detail.name} data={detail} />
                        );

                    case ApplicationFormFieldType.pdfUpload:
                        return (
                            <ApplicationDetailsPdfDownload
                                key={detail.name}
                                titleData={title}
                                data={detail}
                            />
                        );
                }
            })}

            <div className="mt-5 text-blue-600 cursor-pointer text-center" onClick={handleCollapse}>
                <FontAwesomeIcon icon={faChevronUp} />
                <span className="underline mx-3">Einklappen</span>
                <FontAwesomeIcon icon={faChevronUp} />
            </div>
        </div>
    );
};

export default ApplicationDetails;
