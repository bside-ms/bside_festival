import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactElement } from 'react';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

export interface ProgramItemTypeFilter {
    value: 'concerts' | 'workshops' | 'readings' | 'performances' | 'familyPrograms' | 'exhibitions' | 'foods' | 'informationBooths';
    label: string;
}

const availableProgramItemTypeFilters = new Array<ProgramItemTypeFilter>(
    { value: 'concerts', label: 'Konzerte' },
    { value: 'workshops', label: 'Workshops' },
    { value: 'readings', label: 'Lesungen' },
    { value: 'performances', label: 'Performances' },
    { value: 'familyPrograms', label: 'Familienprogramm' },
    { value: 'exhibitions', label: 'Ausstellungen' },
    { value: 'foods', label: 'Essensstände' },
    { value: 'informationBooths', label: 'Infostände' },
);

interface ProgramItemTypeFiltersContextData {
    filteredProgramItemTypeFilters: Array<ProgramItemTypeFilter['value']>;
    toggleProgramItemTypeFilter: (type: ProgramItemTypeFilter['value']) => void;
    isProgramItemTypeFiltered: (type: ProgramItemTypeFilter['value']) => boolean;
}

const ProgramItemTypeFiltersContext = createContext<ProgramItemTypeFiltersContextData | null>(null);

interface Props {
    children: ReactElement;
}

const ProgramItemTypeFiltersContextProvider = ({ children }: Props): ReactElement => {

    const [filteredProgramItemTypeFilters, setFilteredProgramItemTypeFilters] = useState<Array<ProgramItemTypeFilter['value']>>([]);

    const toggleProgramItemTypeFilter = useCallback(
        (type: ProgramItemTypeFilter['value']): void => {
            setFilteredProgramItemTypeFilters(prevTypes => {

                if (prevTypes.includes(type)) {
                    return prevTypes.filter(prevType => prevType !== type);
                }

                return [...prevTypes, type];
            });
        },
        []
    );

    const isProgramItemTypeFiltered = useCallback(
        (type: ProgramItemTypeFilter['value']): boolean => filteredProgramItemTypeFilters.includes(type),
        [filteredProgramItemTypeFilters]
    );

    return (
        <ProgramItemTypeFiltersContext.Provider
            value={{
                filteredProgramItemTypeFilters,
                toggleProgramItemTypeFilter,
                isProgramItemTypeFiltered,
            }}
        >
            {children}
        </ProgramItemTypeFiltersContext.Provider>
    );
};

const useProgramItemTypeFiltersContext = (): ProgramItemTypeFiltersContextData => {

    const programItemTypeFiltersContext = useContext(ProgramItemTypeFiltersContext);

    if (programItemTypeFiltersContext === null) {
        throw new Error('useProgramItemTypeFiltersContext must only be used within corresponding provider!');
    }

    return programItemTypeFiltersContext;
};

const useIsProgramItemFilteredFunction = (): (programItem: ProgramItem | FullTimeProgramItem) => boolean => {

    const { filteredProgramItemTypeFilters } = useProgramItemTypeFiltersContext();

    return (programItem: ProgramItem | FullTimeProgramItem): boolean => {

        if ('concert_artist' in programItem.attributes) {
            return filteredProgramItemTypeFilters.includes('concerts');
        }
        if ('workshop_organizer' in programItem.attributes) {
            return filteredProgramItemTypeFilters.includes('workshops');
        }
        if ('reading_artist' in programItem.attributes) {
            return filteredProgramItemTypeFilters.includes('readings');
        }
        if ('performance_artist' in programItem.attributes) {
            return filteredProgramItemTypeFilters.includes('performances');
        }
        if ('family_program_organizer' in programItem.attributes) {
            return filteredProgramItemTypeFilters.includes('familyPrograms');
        }
        if ('exhibition_artist' in programItem.attributes) {
            return filteredProgramItemTypeFilters.includes('exhibitions');
        }
        if ('information_booth_organizer' in programItem.attributes) {
            return filteredProgramItemTypeFilters.includes('informationBooths');
        }
        if ('food_organizer' in programItem.attributes) {
            return filteredProgramItemTypeFilters.includes('foods');
        }

        return false;
    };
};

export {
    availableProgramItemTypeFilters,
    ProgramItemTypeFiltersContextProvider,
    useProgramItemTypeFiltersContext,
    useIsProgramItemFilteredFunction,
};
