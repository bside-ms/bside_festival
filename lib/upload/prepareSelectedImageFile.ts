'use client';

import blobToDataUrl from '@/lib/common/helper/blobToDataUrl';
import allowedImageContentTypes from '@/lib/upload/allowedImageContentTypes';
import allowedImageMaxFileSize from '@/lib/upload/allowedImageMaxFileSize';
import { participantImageJpegQuality, participantImageMaxEdgePx } from '@/lib/upload/participantImageLimits';
import bytes from 'bytes';
import { extension } from 'mime-types';

type PreparedImageFile = { ok: true; dataUrl: string } | { ok: false; message: string };

const compressImageFile = async (file: File): Promise<string | null> => {
    if (typeof createImageBitmap !== 'function') {
        return null;
    }

    let bitmap: ImageBitmap;

    try {
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
        try {
            bitmap = await createImageBitmap(file);
        } catch {
            return null;
        }
    }

    try {
        const scale = Math.min(1, participantImageMaxEdgePx / Math.max(bitmap.width, bitmap.height));
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        if (context === null) {
            return null;
        }

        context.drawImage(bitmap, 0, 0, width, height);

        return canvas.toDataURL('image/jpeg', participantImageJpegQuality / 100);
    } finally {
        bitmap.close();
    }
};

const prepareSelectedImageFile = async (file: File): Promise<PreparedImageFile> => {
    if (!allowedImageContentTypes.includes(file.type)) {
        return {
            ok: false,
            message: `Dateityp nicht zulässig, erlaubt sind ${allowedImageContentTypes.map((type) => `.${extension(type)}`).join(', ')}`,
        };
    }

    if (file.size > allowedImageMaxFileSize) {
        return {
            ok: false,
            message: `Max. ${bytes.format(allowedImageMaxFileSize, { unitSeparator: '', unit: 'MB' })} zulässig`,
        };
    }

    const compressed = await compressImageFile(file);

    if (compressed !== null) {
        return { ok: true, dataUrl: compressed };
    }

    const imageDataUrl = await blobToDataUrl(file);

    if (typeof imageDataUrl !== 'string') {
        return { ok: false, message: 'Es ist ein technischer Fehler aufgetreten' };
    }

    return { ok: true, dataUrl: imageDataUrl };
};

export default prepareSelectedImageFile;
