import process from 'process';
import isEmptyString from 'lib/common/helper/isEmptyString';

const createPublicObjectUrl = (fileName: string): string => {

    if (isEmptyString(process.env.NEXT_PUBLIC_IONOS_HOST_NAME) || isEmptyString(process.env.NEXT_PUBLIC_IONOS_BUCKET_NAME)) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Missing env variables while creating object URL, "${process.env.NEXT_PUBLIC_IONOS_HOST_NAME}", "${process.env.NEXT_PUBLIC_IONOS_BUCKET_NAME}"`);
    }

    return `https://${process.env.NEXT_PUBLIC_IONOS_HOST_NAME}/${process.env.NEXT_PUBLIC_IONOS_BUCKET_NAME}/${fileName}`;
};

export default createPublicObjectUrl;
