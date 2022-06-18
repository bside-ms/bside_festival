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
            formats: Record<'thumbnail' | 'small' | 'medium' | 'large', {
                url: string;
                height: number;
                width: number;
                size: number;
                ext: string;
                hash: string;
                mime: string;
                name: string;
                path: null;
            }>;
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
