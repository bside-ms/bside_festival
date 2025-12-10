import isEmptyString from '@/lib/common/helper/isEmptyString';
import { S3Client } from '@aws-sdk/client-s3';

const createS3Client = (): S3Client => {
    const { NEXT_PUBLIC_IONOS_HOST_NAME, IONOS_ACCESS_KEY_ID, IONOS_SECRET_ACCESS_KEY } = process.env;

    if (isEmptyString(NEXT_PUBLIC_IONOS_HOST_NAME) || isEmptyString(IONOS_ACCESS_KEY_ID) || isEmptyString(IONOS_SECRET_ACCESS_KEY)) {
        throw new Error('Missing env variables while creating S3 client');
    }

    return new S3Client({
        endpoint: {
            hostname: NEXT_PUBLIC_IONOS_HOST_NAME,
            protocol: 'https:',
            path: '/',
        },
        credentials: {
            accessKeyId: IONOS_ACCESS_KEY_ID,
            secretAccessKey: IONOS_SECRET_ACCESS_KEY,
        },
        region: 'de',
    });
};

export default createS3Client;
