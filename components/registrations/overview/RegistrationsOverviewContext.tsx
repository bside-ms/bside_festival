import { createContext, useContext } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type Registration from 'lib/registrations/Registration';
import type AllFullTimeProgramItems from 'lib/strapi/typings/AllFullTimeProgramItems';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

interface RegistrationsOverviewContextData {
    allRegistrations: Array<Registration>;
    allProgramItems: AllProgramItems;
    allFullTimeProgramItems: AllFullTimeProgramItems;
}

const RegistrationsOverviewContext = createContext<RegistrationsOverviewContextData | null>(null);

interface Props {
    allRegistrations: Array<Registration>;
    allProgramItems: AllProgramItems;
    allFullTimeProgramItems: AllFullTimeProgramItems;
    children: ReactNode;
}

const RegistrationsOverviewContextProvider = (
    { allRegistrations, allProgramItems, allFullTimeProgramItems, children }: Props
): ReactElement => {

    return (
        <RegistrationsOverviewContext.Provider value={{ allRegistrations, allProgramItems, allFullTimeProgramItems }}>
            {children}
        </RegistrationsOverviewContext.Provider>
    );
};

const useRegistrationsOverviewContext = (): RegistrationsOverviewContextData => {

    const RegistrationsOverviewContextContext = useContext(RegistrationsOverviewContext);

    if (RegistrationsOverviewContextContext === null) {
        throw new Error('useRegistrationsOverviewContext must only be used within corresponding provider!');
    }

    return RegistrationsOverviewContextContext;
};

interface RegistrationProgramGroup {
    programType: string;
    programId: number;
    registrations: Array<Registration>;
}

const useRegistrationsGroupedByProgram = (): Array<RegistrationProgramGroup> => {

    const { allRegistrations } = useRegistrationsOverviewContext();

    return allRegistrations.reduce(
        (registrationsGroupedByProgram, registration) => {

            const registrationProgramGroup = registrationsGroupedByProgram.find(
                reg => (
                    reg.programId === registration.programId &&
                    reg.programType === registration.programType
                )
            );

            if (registrationProgramGroup !== undefined) {
                registrationProgramGroup.registrations.push(registration);
            } else {
                registrationsGroupedByProgram.push({
                    programId: registration.programId,
                    programType: registration.programType,
                    registrations: [registration],
                });
            }

            return registrationsGroupedByProgram;
        },
        new Array<RegistrationProgramGroup>()
    );
};

// eslint-disable-next-line complexity
const useRegistrationProgramItem = (programType: string, programId: number): ProgramItem | FullTimeProgramItem | null => {

    const { allProgramItems, allFullTimeProgramItems } = useRegistrationsOverviewContext();

    switch (programType as StrapiCollectionType) {
        case 'concert':
            return allProgramItems.concerts?.find(item => item.id === programId) ?? null;

        case 'workshop':
            return allProgramItems.workshops?.find(item => item.id === programId) ?? null;

        case 'reading':
            return allProgramItems.readings?.find(item => item.id === programId) ?? null;

        case 'performance':
            return allProgramItems.performances?.find(item => item.id === programId) ?? null;

        case 'family-program':
            return allProgramItems.familyPrograms?.find(item => item.id === programId) ?? null;

        case 'exhibition':
            return allFullTimeProgramItems.exhibitions?.find(item => item.id === programId) ?? null;

        case 'information-booth':
            return allFullTimeProgramItems.informationBooths?.find(item => item.id === programId) ?? null;

        case 'food':
            return allFullTimeProgramItems.foods?.find(item => item.id === programId) ?? null;
    }

    return null;
};

export {
    RegistrationsOverviewContextProvider,
    useRegistrationsOverviewContext,
    useRegistrationsGroupedByProgram,
    useRegistrationProgramItem,
};
