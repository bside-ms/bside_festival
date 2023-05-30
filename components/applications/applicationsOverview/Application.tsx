import { useCallback } from 'react';
import type { ReactElement } from 'react';
import ApplicationDetails from 'components/applications/applicationDetails/ApplicationDetails';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import typeLabels from 'lib/participants/typeLabels';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'pages/bewerbungen/[idAndName]';

interface Props {
    application: SerializableParticipant;
}

const Application = ({ application }: Props): ReactElement => {

    const { enhancedApplicationIds, toggleEnhancedApplicationId, getLinksOfApplication } = useApplicationsOverviewContext();

    const { id, name, type, imageFileName } = application;

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    const handleEnhancedToggle = useCallback(
        () => toggleEnhancedApplicationId(id),
        [id, toggleEnhancedApplicationId]
    );

    if (enhancedApplicationIds.includes(id)) {
        return (
            <div className="relative">
                <ApplicationDetails application={application} links={getLinksOfApplication(id)} />

                <a
                    className="absolute left-1/2 -translate-x-1/2 bg-white rounded-xl px-4 py-1 drop-shadow bottom-0 translate-y-2/3 md:cursor-pointer"
                    onClick={handleEnhancedToggle}
                >
                    Einklappen
                </a>
            </div>
        );
    }

    return (
        <a className="p-3 rounded-md shadow-lg relative text-gray-800 md:cursor-pointer md:hover:bg-gray-100" onClick={handleEnhancedToggle}>
            {isNotEmptyString(imageUrl) && (
                <div
                    className="w-full h-32 md:h-52 relative rounded-md overflow-hidden mb-2"
                >
                    <div
                        className="bg-center bg-cover bg-no-repeat absolute top-0 right-0 bottom-0 left-0"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <div
                        className="bg-center bg-contain backdrop-blur-2xl bg-no-repeat absolute top-0 right-0 bottom-0 left-0"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                </div>
            )}

            <div className="uppercase text-sm text-gray-600">{typeLabels[type]}</div>

            <div className="text-xl">{name}</div>
        </a>
    );
};

export default Application;
