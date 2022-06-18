import { useCallback } from 'react';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement, SyntheticEvent } from 'react';
import useSWR from 'swr';
import ApplicationDetailsImage from 'components/applications/ApplicationDetailsImage';
import ApplicationDetailsPdfDownload from 'components/applications/ApplicationDetailsPdfDownload';
import ApplicationDetailsText from 'components/applications/ApplicationDetailsText';
import CopyApplicationLink from 'components/applications/CopyApplicationLink';
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
        <div className="space-y-2">
            <div className="flex justify-between">
                <div className="font-bold">
                    {title?.value ?? 'Kein Titel'}
                </div>

                <CopyApplicationLink applicationId={id} />
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

            <div
                className={`
                    pt-2
                    text-blue-600
                    cursor-pointer
                    sticky
                    bottom-0
                `}
                onClick={handleCollapse}
            >
                <div
                    className={`
                        flex
                        justify-center
                        align-middle
                    `}
                >
                    <div
                        className={`
                            rounded-t-lg
                            border-[1px]
                            border-b-0
                            border-gray-700
                            leading-4
                            py-2
                            px-3
                            bg-gray-50
                        `}
                    >
                        <FontAwesomeIcon icon={faChevronUp} />
                        <span className="underline mx-3">Einklappen</span>
                        <FontAwesomeIcon icon={faChevronUp} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;
