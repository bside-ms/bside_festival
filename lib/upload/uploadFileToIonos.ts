import isEmptyString from '@/lib/common/helper/isEmptyString';
import hashData from '@/lib/crypto/hashData';
import parseEncodedFile from '@/lib/upload/parseEncodedFile';
import putObjectToIonos from '@/lib/upload/putObjectToIonos';
import { extension } from 'mime-types';

const generateFileName = (hashInput: string | Buffer, contentType: string): string => {
    const fileExtension = extension(contentType);
    const fileName = hashData(hashInput).slice(0, 35);

    if (fileExtension === false) {
        return fileName;
    }

    return `${fileName}.${fileExtension}`;
};

export const uploadBufferToIonos = async (buffer: Buffer, contentType: string, hashInput: string | Buffer): Promise<string> => {
    const fileName = generateFileName(hashInput, contentType);

    await putObjectToIonos(fileName, contentType, buffer);

    return fileName;
};

const uploadFileToIonos = async (
    encodedFile: string | null,
    allowedContentTypes: Array<string>,
    allowedMaxFileSize: number,
): Promise<string | null> => {
    if (isEmptyString(encodedFile)) {
        return null;
    }

    const { base64Data, buffer, contentType } = parseEncodedFile(encodedFile);

    if (!allowedContentTypes.includes(contentType)) {
        throw new Error(`Unexpected content type ${contentType}, allowed types: ${allowedContentTypes.join(', ')}`);
    }

    if (buffer.length > allowedMaxFileSize) {
        throw new Error(`File size ${buffer.length} is too big, max. ${allowedMaxFileSize} allowed`);
    }

    return uploadBufferToIonos(buffer, contentType, base64Data);
};

export default uploadFileToIonos;
