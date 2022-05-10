import '../styles/globals.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { ReactElement } from 'react';

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => (
    <>
        <Head>
            <title>B-Side - Festival 2022</title>
        </Head>

        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
    </>
);

export default MyApp;
