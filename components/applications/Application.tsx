import { useCallback, useState } from 'react';
import type { ReactElement } from 'react';
import ApplicationDetails from 'components/applications/ApplicationDetails';
import type ApplicationData from 'lib/application-form/ApplicationData';
import useApplicationTitle from 'lib/application-form/useApplicationTitle';
import useApplicationCreatedDate from 'lib/applications/useApplicationCreatedDate';
import useApplicationName from 'lib/applications/useApplicationName';
import useApplicationResidence from 'lib/applications/useApplicationResidence';
import useApplicationTypeColor from 'lib/applications/useApplicationTypeColor';

interface Props {
    application: ApplicationData;
}

const Application = ({ application: { id, type, createdAt, data } }: Props): ReactElement => {

    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = useCallback(() => setIsExpanded(true), [setIsExpanded]);
    const handleCollapse = useCallback(() => setIsExpanded(false), [setIsExpanded]);

    const applicationTitle = useApplicationTitle(type);
    const applicationTypeColor = useApplicationTypeColor(type);

    const name = useApplicationName(type, data);
    const residence = useApplicationResidence(data);
    const createdDate = useApplicationCreatedDate(createdAt);

    const containerCursor = isExpanded ? 'cursor-default' : 'cursor-pointer';

    return (
        <div
            className={`rounded border-[1px] border-gray-700 bg-gray-50 p-3 drop-shadow-lg ${containerCursor}`}
            onClick={handleExpand}
        >
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

            <div className="mt-3">
                {isExpanded ? (
                    <ApplicationDetails
                        id={id}
                        type={type}
                        data={data}
                        onCollapse={handleCollapse}
                    />
                ) : (
                    <>
                        <span className="font-bold">
                            {name}
                        </span>
                        {' '}
                        <span className="text-[0.7rem] uppercase">
                            {residence}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default Application;
