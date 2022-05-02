import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {

    public render(): JSX.Element {

        return (
            <Html>
                <Head>
                    <link rel="icon" href="/favicon.ico" />

                    {/* eslint-disable-next-line @next/next/no-title-in-document-head */}
                    <title>B-Side - Festival 2022</title>

                    <link
                        href="https://fonts.googleapis.com/css2?family=Londrina+Outline&family=Londrina+Solid:wght@100;300;400;900&display=swap"
                        rel="stylesheet"
                    />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
