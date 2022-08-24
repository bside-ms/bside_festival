import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import getAvailableDates from 'lib/strapi/getAvailableDates';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';

interface ProgramContextData {
    programDate: ProgramDate;
    setProgramDay: (day: 1 | 2 | 3) => void;
}

const ProgramContext = createContext<ProgramContextData | null>(null);

const ProgramContextProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const availableDates = getAvailableDates();

    const [programDate, setProgramDate] = useState<ProgramDate>(availableDates[0]!);

    const setProgramDay = useCallback((day: 1 | 2 | 3): void => {

        setProgramDate(availableDates[day - 1]!);
    }, [availableDates]);

    return (
        <ProgramContext.Provider value={{ programDate, setProgramDay }}>
            {children}
        </ProgramContext.Provider>
    );
};

const useProgramContext = (): ProgramContextData => {

    const ProgramContextContext = useContext(ProgramContext);

    if (ProgramContextContext === null) {
        throw new Error('useProgramContext must only be used within corresponding provider!');
    }

    return ProgramContextContext;
};

export {
    ProgramContextProvider,
    useProgramContext,
};
