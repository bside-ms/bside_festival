import Head from 'next/head';
import type { ReactElement } from 'react';

interface Props {
    title: string;
}

const NextHead = ({ title }: Props): ReactElement => (
    <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
        <meta property="og:description" content="B-Side Festival 2022 - Zurück für die Zukunft" />
        <meta property="og:image" content="https://festival.b-side.ms/assets/images/festival/19-537-min.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="de_DE" />
    </Head>
);

export default NextHead;
