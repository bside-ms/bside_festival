import { useMemo } from 'react';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import Location from 'components/locations/Location';
import orderLocations from 'lib/strapi/orderLocations';
import type { default as LocationModel } from 'lib/strapi/typings/Location';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';

interface Props {
    allLocations: Array<LocationModel>;
    allLocationGroups: Array<LocationGroup>;
}

const LocationsList = ({ allLocations, allLocationGroups }: Props): ReactElement => {

    const orderedLocations = useMemo(
        () => orderLocations(allLocations, allLocationGroups),
        [allLocations, allLocationGroups]
    );

    return (
        <div className="my-8">
            <ContentWrapper>
                <div className="space-y-5">
                    {orderedLocations.map(location => (
                        <Location
                            key={location.id}
                            location={location}
                            locationGroups={allLocationGroups}
                        />
                    ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default LocationsList;
