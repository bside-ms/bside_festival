import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { ReactElement } from 'react';
import NextHead from 'components/common/NextHead';

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
    return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        <SessionProvider session={pageProps.session}>
            <NextHead title="B-Side Festival 2024" />
            <Component {...pageProps} />
        </SessionProvider>
    );
};

export default MyApp;
