import type { NextPage } from 'next';

const Robots: NextPage = () => null;

// eslint-disable-next-line @typescript-eslint/require-await
Robots.getInitialProps = async ({ res }): Promise<void> => {
    if (res === undefined) {
        return;
    }

    res.setHeader('Content-Type', 'text/plain');

    // Return a non-crawlable robots.txt in non-production environment
    res.write(process.env.NEXT_ENV !== 'production' ? 'User-agent: *\nDisallow: /' : '');

    res.end();
};

export default Robots;
