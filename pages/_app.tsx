import '../styles/globals.css';

import type { AppProps } from 'next/app';
import type { ReactElement } from 'react';
import NextHead from 'components/common/NextHead';

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => (
    <>
        <NextHead title="B-Side Festival 2022" />

        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
    </>
);

export default MyApp;
