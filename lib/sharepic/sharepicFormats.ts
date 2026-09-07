export const sharepicFormats = {
    feed: { height: 1350, label: 'Feed', width: 1080 },
    story: { height: 1920, label: 'Story', width: 1080 },
} as const;

export type SharepicFormat = keyof typeof sharepicFormats;
export type SharepicLang = 'de' | 'en';
export type SharepicCrop = {
    zoom: number;
    x: number;
    y: number;
};

const sharepicCropDefaults: SharepicCrop = { x: 50, y: 50, zoom: 1 };
export const sharepicZoomMax = 3;

export const parseSharepicFormat = (value: string | null): SharepicFormat => (value === 'story' ? 'story' : 'feed');

export const parseSharepicShowPhoto = (value: string | null): boolean => value !== '0';

export const parseSharepicLang = (value: string | null): SharepicLang => (value === 'en' ? 'en' : 'de');

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const parseNumber = (value: string | null, fallback: number): number => {
    if (value === null || value.trim() === '') {
        return fallback;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
};

export const parseSharepicZoom = (value: string | null): number => clamp(Math.round(parseNumber(value, 1) * 10) / 10, 1, sharepicZoomMax);

export const parseSharepicPosition = (value: string | null): number => Math.round(clamp(parseNumber(value, 50), 0, 100));

export const sharepicNameFontSize = (name: string, inCard: boolean, isStory: boolean): number => {
    const base = inCard ? (isStory ? 110 : 96) : isStory ? 88 : 80;

    if (name.length > 48) {
        return Math.round(base * 0.55);
    }

    if (name.length > 32) {
        return Math.round(base * 0.7);
    }

    if (name.length > 20) {
        return Math.round(base * 0.85);
    }

    return base;
};

export const sharepicPhotoBox = ({
    appearances,
    canceled,
    format,
    name,
    showPhoto,
}: {
    appearances: Array<{ when: string }>;
    canceled: boolean;
    format: SharepicFormat;
    name: string;
    showPhoto: boolean;
}): { height: number; width: number } => {
    const isStory = format === 'story';
    const { height, width } = sharepicFormats[format];
    const pad = isStory ? 52 : 40;
    const logoSize = isStory ? 180 : 132;
    const titleSize = sharepicNameFontSize(name, !showPhoto, isStory);
    const placeSize = isStory ? 56 : 52;
    const whenSize = isStory ? 52 : 48;
    const nameBlock = showPhoto ? (isStory ? 24 : 18) + Math.round(titleSize * 0.95) : 0;
    const canceledBlock = canceled ? (isStory ? 40 : 36) + 24 + 14 : 0;
    const appearanceBlocks = appearances.reduce((total, appearance) => {
        const whenBlock = appearance.when === '' ? 0 : Math.round(whenSize * 1.15) + 4;

        return total + whenBlock + Math.round(placeSize * 1.1) + 10;
    }, 0);
    const used = pad * 2 + logoSize + (isStory ? 28 : 18) + nameBlock + (isStory ? 24 : 16) + canceledBlock + appearanceBlocks;

    return {
        height: Math.max(400, height - used),
        width: width - pad * 2,
    };
};

export const sharepicCoverCrop = (
    imageWidth: number,
    imageHeight: number,
    box: { height: number; width: number },
    crop: SharepicCrop,
): { height: number; left: number; top: number; width: number } => {
    const scale = Math.max(box.width / imageWidth, box.height / imageHeight) * crop.zoom;
    const rawWidth = Math.min(imageWidth, box.width / scale);
    const rawHeight = Math.min(imageHeight, box.height / scale);
    const width = Math.max(1, Math.min(imageWidth, Math.round(rawWidth)));
    const height = Math.max(1, Math.min(imageHeight, Math.round(rawHeight)));
    const maxLeft = imageWidth - width;
    const maxTop = imageHeight - height;

    return {
        height,
        left: Math.max(0, Math.min(maxLeft, Math.round(maxLeft * (crop.x / 100)))),
        top: Math.max(0, Math.min(maxTop, Math.round(maxTop * (crop.y / 100)))),
        width,
    };
};

export const sharepicImagePath = (
    id: number,
    format: SharepicFormat,
    showPhoto: boolean,
    lang: SharepicLang,
    crop: SharepicCrop = sharepicCropDefaults,
    download = false,
): string => {
    const params = new URLSearchParams({ format });

    if (!showPhoto) {
        params.set('photo', '0');
    }

    if (lang === 'en') {
        params.set('lang', 'en');
    }

    if (crop.zoom !== sharepicCropDefaults.zoom) {
        params.set('zoom', crop.zoom.toString());
    }

    if (crop.x !== sharepicCropDefaults.x) {
        params.set('x', crop.x.toString());
    }

    if (crop.y !== sharepicCropDefaults.y) {
        params.set('y', crop.y.toString());
    }

    if (download) {
        params.set('download', '1');
    }

    return `/programm/${id}/sharepic/image?${params.toString()}`;
};
