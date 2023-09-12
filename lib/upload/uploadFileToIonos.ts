import { extension } from 'mime-types';
import isEmptyString from 'lib/common/helper/isEmptyString';
import hashData from 'lib/crypto/hashData';
import createPutObjectCommand from 'lib/upload/createPutObjectCommand';
import createS3Client from 'lib/upload/createS3Client';

const generateFileName = (base64Data: string, contentType: string): string => {
    const fileExtension = extension(contentType);

    const fileName = hashData(base64Data).slice(0, 35);

    if (fileExtension === false) {
        return fileName;
    }

    return `${fileName}.${fileExtension}`;
};

const uploadFileToIonos = async (
    encodedFile: string,
    allowedContentTypes: Array<string>,
    allowedMaxFileSize: number,
): Promise<string | null> => {
    if (isEmptyString(encodedFile)) {
        return null;
    }

    const fileEncodingMatch = /^data:([\w/]+);base64,/.exec(encodedFile);

    if (fileEncodingMatch === null || fileEncodingMatch[1] === undefined) {
        throw new Error(`Malformed file encoding, ${encodedFile.slice(0, 50)}...`);
    }

    const [match, contentType] = fileEncodingMatch;

    if (!allowedContentTypes.includes(contentType)) {
        throw new Error(`Unexpected content type ${contentType}, allowed types: ${allowedContentTypes.join(', ')}`);
    }

    const base64Data = encodedFile.replace(match, '');

    const fileName = generateFileName(base64Data, contentType);

    const buffer = Buffer.from(base64Data, 'base64');

    if (buffer.length > allowedMaxFileSize) {
        throw new Error(`File size ${buffer.length} is too big, max. ${allowedMaxFileSize} allowed`);
    }

    const s3Client = createS3Client();

    const putObjectCommand = createPutObjectCommand(fileName, contentType, buffer);

    const output = await s3Client.send(putObjectCommand);

    if (output.$metadata.httpStatusCode !== 200) {
        throw new Error(`Error while uploading file, ${JSON.stringify(output)}`);
    }

    return fileName;
};

export default uploadFileToIonos;
