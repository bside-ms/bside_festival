export const sharepicFormats = {
    feed: { height: 1350, label: 'Feed', width: 1080 },
    story: { height: 1920, label: 'Story', width: 1080 },
} as const;

export type SharepicFormat = keyof typeof sharepicFormats;
export type SharepicLang = 'de' | 'en';

export const parseSharepicFormat = (value: string | null): SharepicFormat => (value === 'story' ? 'story' : 'feed');

export const parseSharepicShowPhoto = (value: string | null): boolean => value !== '0';

export const parseSharepicLang = (value: string | null): SharepicLang => (value === 'en' ? 'en' : 'de');

export const sharepicImagePath = (id: number, format: SharepicFormat, showPhoto: boolean, lang: SharepicLang, download = false): string => {
    const params = new URLSearchParams({ format });

    if (!showPhoto) {
        params.set('photo', '0');
    }

    if (lang === 'en') {
        params.set('lang', 'en');
    }

    if (download) {
        params.set('download', '1');
    }

    return `/programm/${id}/sharepic/image?${params.toString()}`;
};
