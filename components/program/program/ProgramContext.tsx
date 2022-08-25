import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toNumber } from 'lodash';
import type { ReactElement, ReactNode } from 'react';
import getAvailableDates from 'lib/strapi/getAvailableDates';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';

interface ProgramContextData {
    // Server-side it's null
    programDate: ProgramDate | null;
    setProgramDay: (day: 1 | 2 | 3) => void;
}

const ProgramContext = createContext<ProgramContextData | null>(null);

const getInitialDay = (): number | null => {

    if (typeof window !== 'undefined') {
        const hash = toNumber(window.location.hash.replace('#', ''));

        if (!isNaN(hash) && [1, 2, 3].includes(hash)) {
            return hash;
        }

        return 1;
    }

    return null;
};

const ProgramContextProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const availableDates = getAvailableDates();

    const [programDate, setProgramDate] = useState<ProgramDate | null>(null);

    useEffect(() => {

        console.log('using effect');

        const initialDay = getInitialDay();

        setProgramDate(initialDay === null ? null : availableDates[initialDay - 1]!);
    }, []);

    const setProgramDay = useCallback((day: 1 | 2 | 3): void => {

        window.location.hash = day.toString();

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
