import type GenericImagesData from 'lib/strapi/typings/GenericImagesData';
import type StrapiResponse from 'lib/strapi/typings/StrapiResponse';

const fixImageUrls = <T extends StrapiResponse<Array<{ attributes: { Images: GenericImagesData }}>>>(strapiResponse: T): T => {

    const strapiBaseUrl = process.env.STRAPI_BASE_URL!;

    if (strapiResponse.data === null) {
        return strapiResponse;
    }

    strapiResponse.data.forEach(responseEntry => {
        if (responseEntry.attributes.Images.data === null) {
            return;
        }

        responseEntry.attributes.Images.data.forEach(image => {
            image.attributes.url = `${strapiBaseUrl}${image.attributes.url}`;

            Object.values(image.attributes.formats).forEach(format => {
                format.url = `${strapiBaseUrl}${format.url}`;
            });
        });
    });

    return strapiResponse;
};

export default fixImageUrls;
