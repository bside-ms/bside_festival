import { useMemo } from 'react';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import Location from 'components/locations/Location';
import type { default as LocationModel } from 'lib/strapi/typings/Location';
import useLocationsSortingCallback from 'lib/strapi/useLocationsSortingCallback';

interface Props {
    allLocations: Array<LocationModel>;
}

const LocationsList = ({ allLocations }: Props): ReactElement => {

    const orderedLocations = useMemo(
        () => allLocations.sort(useLocationsSortingCallback),
        [allLocations]
    );

    return (
        <div className="my-8">
            <ContentWrapper>
                <div className="space-y-5">
                    {orderedLocations.map(location => (
                        <Location
                            key={location.id}
                            location={location}
                        />
                    ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default LocationsList;
