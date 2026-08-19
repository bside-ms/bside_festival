import isEmptyString from '@/lib/common/helper/isEmptyString';
import allowedImageContentTypes from '@/lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from '@/lib/upload/allowedImageMaxFileSize';
import normalizeUploadedImage from '@/lib/upload/normalizeUploadedImage';
import parseEncodedFile from '@/lib/upload/parseEncodedFile';
import { uploadBufferToIonos } from '@/lib/upload/uploadFileToIonos';

const jpegContentType = 'image/jpeg';

const uploadImageToIonos = async (encodedFile: string | null): Promise<string | null> => {
    if (isEmptyString(encodedFile)) {
        return null;
    }

    const { buffer, contentType } = parseEncodedFile(encodedFile);

    if (!allowedImageContentTypes.includes(contentType)) {
        throw new Error(`Unexpected content type ${contentType}, allowed types: ${allowedImageContentTypes.join(', ')}`);
    }

    if (buffer.length > allowedImageMaxFileSize) {
        throw new Error(`File size ${buffer.length} is too big, max. ${allowedImageMaxFileSize} allowed`);
    }

    const normalized = await normalizeUploadedImage(buffer);

    if (normalized.length > allowedImageMaxFileSize) {
        throw new Error(`Normalized image size ${normalized.length} is too big, max. ${allowedImageMaxFileSize} allowed`);
    }

    return uploadBufferToIonos(normalized, jpegContentType, normalized);
};

export default uploadImageToIonos;
