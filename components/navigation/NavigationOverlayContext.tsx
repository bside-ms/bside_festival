import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

interface NavigationOverlayContextData {
    isOverlayShown: boolean;
    toggleOverlay: () => void;
    closeOverlay: () => void;
}

const NavigationOverlayContext = createContext<NavigationOverlayContextData | null>(null);

const NavigationOverlayContextProvider = ({ children }: { children: ReactNode }): ReactElement => {
    const [isOverlayShown, setIsOverlayShown] = useState(false);

    const toggleOverlay = useCallback((): void => {
        setIsOverlayShown((prevState) => !prevState);
    }, []);

    const closeOverlay = useCallback((): void => {
        setIsOverlayShown(false);
    }, []);

    return (
        <NavigationOverlayContext.Provider value={{ isOverlayShown, toggleOverlay, closeOverlay }}>
            {children}
        </NavigationOverlayContext.Provider>
    );
};

const useNavigationOverlayContext = (): NavigationOverlayContextData => {
    const NavigationOverlayContextContext = useContext(NavigationOverlayContext);

    if (NavigationOverlayContextContext === null) {
        throw new Error('useNavigationOverlayContext must only be used within corresponding provider!');
    }

    return NavigationOverlayContextContext;
};

export { NavigationOverlayContextProvider, useNavigationOverlayContext };
