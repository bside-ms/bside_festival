const getAbsoluteImageUrl = (relativeImageUrl: string): string => {

    return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_BASE_URL}${relativeImageUrl}`;
};

export default getAbsoluteImageUrl;
