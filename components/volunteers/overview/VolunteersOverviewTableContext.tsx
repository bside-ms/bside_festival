import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

interface VolunteersOverviewTableContextData {
    notTruncatedRows: Array<number>;
    toggleTruncatedRow: (volunteerId: number) => void;
}

const VolunteersOverviewTableContext = createContext<VolunteersOverviewTableContextData | null>(null);

const VolunteersOverviewTableContextProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [notTruncatedRows, setNotTruncatedRows] = useState<Array<number>>([]);

    const toggleTruncatedRow = useCallback((volunteerId: number): void => {

        setNotTruncatedRows(prevState => {
            if (prevState.includes(volunteerId)) {
                return prevState.filter(id => id !== volunteerId);
            } else {
                return [...prevState, volunteerId];
            }
        });
    }, []);

    return (
        <VolunteersOverviewTableContext.Provider value={{ notTruncatedRows, toggleTruncatedRow }}>
            {children}
        </VolunteersOverviewTableContext.Provider>
    );
};

const useVolunteersOverviewTableContext = (): VolunteersOverviewTableContextData => {

    const VolunteersOverviewTableContextContext = useContext(VolunteersOverviewTableContext);

    if (VolunteersOverviewTableContextContext === null) {
        throw new Error('useVolunteersOverviewTableContext must only be used within corresponding provider!');
    }

    return VolunteersOverviewTableContextContext;
};

export {
    VolunteersOverviewTableContextProvider,
    useVolunteersOverviewTableContext,
};
