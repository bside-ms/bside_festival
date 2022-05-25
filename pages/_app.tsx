import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { ReactElement } from 'react';
import NextHead from 'components/common/NextHead';

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => (
    <SessionProvider session={pageProps.session}>
        <NextHead title="B-Side Festival 2022" />

        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
    </SessionProvider>
);

export default MyApp;
