import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { ReactElement } from 'react';
import NextHead from 'components/common/NextHead';
import { NavigationOverlayContextProvider } from 'components/navigation/NavigationOverlayContext';

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {

    return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        <SessionProvider session={pageProps.session}>
            <NextHead title="B-Side Festival 2022" />

            <NavigationOverlayContextProvider>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...pageProps} />
            </NavigationOverlayContextProvider>
        </SessionProvider>
    );
};

export default MyApp;
