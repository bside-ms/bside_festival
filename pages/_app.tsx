import '../styles/globals.css';

import { type ReactElement, useEffect } from 'react';
import { RouterScrollProvider } from '@moxy/next-router-scroll';
import { init } from '@socialgouv/matomo-next';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import NextHead from 'components/common/NextHead';
import { NavigationOverlayContextProvider } from 'components/navigation/NavigationOverlayContext';

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
    useEffect(() => {
        if (MATOMO_URL === undefined || MATOMO_SITE_ID === undefined) {
            return;
        }
        init({
            url: MATOMO_URL,
            siteId: MATOMO_SITE_ID,
            jsTrackerFile: 'lernen.js',
            phpTrackerFile: 'lernen.php',
        });
    }, []);

    return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        <SessionProvider session={pageProps.session}>
            <NextHead title="B-Side Festival 2022" />

            <RouterScrollProvider disableNextLinkScroll={false}>
                <NavigationOverlayContextProvider>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <Component {...pageProps} />
                </NavigationOverlayContextProvider>
            </RouterScrollProvider>
        </SessionProvider>
    );
};

export default MyApp;
