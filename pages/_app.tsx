import '../styles/globals.css';

import type { AppProps } from 'next/app';
import type { ReactElement } from 'react';

// eslint-disable-next-line react/jsx-props-no-spreading
const MyApp = ({ Component, pageProps }: AppProps): ReactElement => <Component {...pageProps} />;

export default MyApp;
