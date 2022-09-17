
import type { ReactElement } from 'react';
import Location from 'components/locations/Location';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import type AllFullTimeProgramItemsResponse from 'lib/strapi/typings/AllFullTimeProgramItemsResponse';
import type AllProgramItemsResponse from 'lib/strapi/typings/AllProgramItemsResponse';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import useAllFullTimeProgramItems from 'lib/strapi/useAllFullTimeProgramItems';
import useAllProgramItems from 'lib/strapi/useAllProgramItems';

interface Props {
    locationGroup: LocationGroup;
}

const LocationWithProgramWrapper = ({ locationGroup }: Props): ReactElement => {

    const swrProgramItemsResponse = useAllProgramItems();
    const swrFullTimeProgramItemsResponse = useAllFullTimeProgramItems();

    return (
        <SwrResponseWrapper<AllProgramItemsResponse>
            response={swrProgramItemsResponse}
        >
            {({ allProgramItems }): ReactElement => (
                <SwrResponseWrapper<AllFullTimeProgramItemsResponse>
                    response={swrFullTimeProgramItemsResponse}
                >
                    {({ allFullTimeProgramItems }): ReactElement => {

                        const programItems = [
                            ...(allProgramItems.concerts ?? []),
                            ...(allProgramItems.performances ?? []),
                            ...(allProgramItems.readings ?? []),
                            ...(allProgramItems.workshops ?? []),
                            ...(allProgramItems.familyPrograms ?? []),
                            ...(allFullTimeProgramItems.informationBooths ?? []),
                            ...(allFullTimeProgramItems.foods ?? []),
                            ...(allFullTimeProgramItems.exhibitions ?? []),
                        ];

                        return (
                            <div>
                                <Location
                                    locationGroup={locationGroup}
                                    programItems={programItems}
                                />
                            </div>
                        );
                    }}
                </SwrResponseWrapper>
            )}
        </SwrResponseWrapper>
    );
};

export default LocationWithProgramWrapper;
