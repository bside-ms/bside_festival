import type { NextApiRequest, NextApiResponse } from 'next';

const handle = (request: NextApiRequest, response: NextApiResponse): void => {

    console.log('request', request);
};

export default handle;
