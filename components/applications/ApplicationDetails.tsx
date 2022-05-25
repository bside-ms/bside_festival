import { useCallback } from 'react';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement, SyntheticEvent } from 'react';
import ApplicationImage from 'components/applications/ApplicationImage';
import type ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationDetails from 'lib/applications/useApplicationDetails';

interface Props {
    id: number;
    type: ApplicationType;
    data: Record<string, string>;
    onCollapse: () => void;
}

const ApplicationDetails = ({ id, type, data, onCollapse }: Props): ReactElement => {

    const [title, ...applicationDetails] = useApplicationDetails(type, data);

    const handleCollapse = useCallback((event: SyntheticEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onCollapse();
    }, [onCollapse]);

    return (
        <div className="space-y-2 overflow-hidden">
            <div className="font-bold">
                {title[1]}
            </div>

            <ApplicationImage applicationId={id} />

            {applicationDetails.map(detail => (
                <div key={detail[0]}>
                    <div className="underline">{detail[0]}</div>
                    <div>{detail[1]}</div>
                </div>
            ))}

            <div className="mt-5 text-blue-600 cursor-pointer text-center" onClick={handleCollapse}>
                <FontAwesomeIcon icon={faChevronUp} />
                <span className="underline mx-3">Einklappen</span>
                <FontAwesomeIcon icon={faChevronUp} />
            </div>
        </div>
    );
};

export default ApplicationDetails;
