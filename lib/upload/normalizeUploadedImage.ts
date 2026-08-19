import sharp from 'sharp';
import { participantImageJpegQuality, participantImageMaxEdgePx } from './participantImageLimits';

const normalizeUploadedImage = async (input: Buffer): Promise<Buffer> => {
    const normalized = await sharp(input, { failOn: 'none', pages: 1 })
        .rotate()
        .resize(participantImageMaxEdgePx, participantImageMaxEdgePx, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ mozjpeg: true, quality: participantImageJpegQuality })
        .toBuffer();

    if (normalized.length === 0) {
        throw new Error('Image normalization produced an empty file');
    }

    return normalized;
};

export default normalizeUploadedImage;
