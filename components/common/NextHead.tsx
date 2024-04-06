import Head from 'next/head';
import type { ReactElement } from 'react';

interface Props {
    title: string;
}

const NextHead = ({ title }: Props): ReactElement => (
    <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
        <meta property="og:description" content="B-Side Festival 2024" />
        <meta property="og:image" content="https://festival.b-side.ms/assets/images/festival/19-537-min.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="de_DE" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/android-chrome-512x512.png" sizes="512x512" />
        <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192" />
    </Head>
);

export default NextHead;
