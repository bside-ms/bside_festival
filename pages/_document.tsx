import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {

    public render(): JSX.Element {

        return (
            <Html>
                <Head>
                    <link rel="icon" href="/favicon.ico" />

                    <link
                        href="https://fonts.googleapis.com/css2?family=Yatra+One&display=swap"
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
