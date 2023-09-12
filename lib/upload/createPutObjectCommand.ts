import process from 'process';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import type { PutObjectCommandInputType } from '@aws-sdk/client-s3/dist-types/commands/PutObjectCommand';

const createPutObjectCommand = (
    objectKey: string,
    objectContentType: string,
    object: PutObjectCommandInputType['Body'],
): PutObjectCommand => {
    return new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_IONOS_BUCKET_NAME,
        Key: objectKey,
        ContentType: objectContentType,
        Body: object,
        ACL: 'public-read',
    });
};

export default createPutObjectCommand;
