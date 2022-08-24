interface ImageSpecs {
    url: string;
    height: number;
    width: number;
    size: number;
    ext: string;
    hash: string;
    mime: string;
    name: string;
    path: null;
}

export interface GenericImagesAttributes {
    url: string;
    height: number;
    width: number;
    size: number;
    caption: string;
    alternativeText: string;
    formats: {
        thumbnail?: ImageSpecs;
        small?: ImageSpecs;
        medium?: ImageSpecs;
        large?: ImageSpecs;
    };
    createdAt: string;
    ext: string;
    hash: string;
    mime: string;
    name: string;
    previewUrl: null;
    provider: string;
    provider_metadata: null;
    updatedAt: string;
}

export default interface GenericImagesData {
    data: null | Array<{
        id: number;
        attributes: {
            url: string;
            height: number;
            width: number;
            size: number;
            caption: string;
            alternativeText: string;
            formats: {
                thumbnail?: ImageSpecs;
                small?: ImageSpecs;
                medium?: ImageSpecs;
                large?: ImageSpecs;
            };
            createdAt: string;
            ext: string;
            hash: string;
            mime: string;
            name: string;
            previewUrl: null;
            provider: string;
            provider_metadata: null;
            updatedAt: string;
        };
    }>;
}
