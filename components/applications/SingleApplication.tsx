import type { ReactElement } from 'react';
import useSWR from 'swr';
import ApplicationDetailsImage from 'components/applications/ApplicationDetailsImage';
import ApplicationDetailsPdfDownload from 'components/applications/ApplicationDetailsPdfDownload';
import ApplicationDetailsText from 'components/applications/ApplicationDetailsText';
import CopyApplicationLink from 'components/applications/CopyApplicationLink';
import type ApplicationData from 'lib/application-form/ApplicationData';
import ApplicationFormFieldType from 'lib/application-form/ApplicationFormFieldType';
import type ApplicationResponse from 'lib/application-form/ApplicationResponse';
import useApplicationTitle from 'lib/application-form/useApplicationTitle';
import useApplicationCreatedDate from 'lib/applications/useApplicationCreatedDate';
import useApplicationDetails from 'lib/applications/useApplicationDetails';
import useApplicationTypeColor from 'lib/applications/useApplicationTypeColor';
import fetcher from 'lib/common/fetcher';

interface Props {
    application: ApplicationData;
}

const SingleApplication = ({ application: { id, type, createdAt, data } }: Props): ReactElement => {

    const applicationTitle = useApplicationTitle(type);
    const applicationTypeColor = useApplicationTypeColor(type);

    const createdDate = useApplicationCreatedDate(createdAt);

    const { data: fetchData, error } = useSWR<ApplicationResponse, Error>(`/api/application/${id}`, fetcher);

    const usedData = error !== undefined || fetchData === undefined || !fetchData.success ? data : fetchData.application.data;

    const [title, ...applicationDetails] = useApplicationDetails(type, usedData);

    return (
        <div className="rounded border-[1px] border-gray-700 bg-gray-50 drop-shadow-lg p-3">
            <div className="flex mb-1 justify-between">
                <div
                    className="px-1 rounded text-[0.8rem]"
                    style={{ backgroundColor: applicationTypeColor }}
                >
                    {applicationTitle}
                </div>

                <div className="text-gray-600 text-[0.8rem]">
                    {createdDate}
                </div>
            </div>

            <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                    <div className="font-bold">
                        {title.value}
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
            </div>
        </div>
    );
};

export default SingleApplication;
