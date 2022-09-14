import { createContext, useContext } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type Registration from 'lib/registrations/Registration';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
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

const useUniqueRegisteredNames = (): Array<string> => {

    const { allRegistrations } = useRegistrationsOverviewContext();

    return allRegistrations.reduce(
        (currentUniqueRegisteredNames, registration) => {

            if (!currentUniqueRegisteredNames.includes(registration.fullName)) {
                currentUniqueRegisteredNames.push(registration.fullName);
            }

            return currentUniqueRegisteredNames;
        },
        new Array<string>()
    );
};

const useMostLoyalRegisteredNames = (): Array<{ name: string, amount: number }> => {

    const { allRegistrations } = useRegistrationsOverviewContext();

    return allRegistrations.reduce(
        (currentMostLoyalNames, registration) => {

            if (!currentMostLoyalNames.some(loyalNames => loyalNames.name === registration.fullName)) {
                currentMostLoyalNames.push({ name: registration.fullName, amount: 0 });
            }

            currentMostLoyalNames.find(loyalNames => loyalNames.name === registration.fullName)!.amount++;

            return currentMostLoyalNames;
        },
        new Array<{ name: string, amount: number }>()
    );
};

const useProgramItemsWithNeedToRegister = (): Array<ProgramItem | FullTimeProgramItem> => {

    const { allProgramItems, allFullTimeProgramItems } = useRegistrationsOverviewContext();

    return [
        ...(allProgramItems.concerts ?? []),
        ...(allProgramItems.workshops ?? []),
        ...(allProgramItems.readings ?? []),
        ...(allProgramItems.familyPrograms ?? []),
        ...(allProgramItems.performances ?? []),
        ...(allFullTimeProgramItems.exhibitions ?? []),
        ...(allFullTimeProgramItems.informationBooths ?? []),
        ...(allFullTimeProgramItems.foods ?? []),
    ].filter(programItem => {

        const { registration } = getDetailsFromProgramItem(programItem);

        return registration?.registrationNecessary === true;
    });
};

const useRegistrationsForProgram = (programItem: ProgramItem | FullTimeProgramItem): Array<Registration> => {

    const { allRegistrations } = useRegistrationsOverviewContext();

    const { collectionType } = getDetailsFromProgramItem(programItem);

    return allRegistrations.filter(
        registration => registration.programId === programItem.id && registration.programType === collectionType
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
    useRegistrationProgramItem,
    useProgramItemsWithNeedToRegister,
    useRegistrationsForProgram,
    useUniqueRegisteredNames,
    useMostLoyalRegisteredNames,
};
