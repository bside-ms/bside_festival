import type StrapiErrorResponse from 'lib/strapi/StrapiErrorResponse';
import type StrapiSuccessResponse from 'lib/strapi/StrapiSuccessResponse';

type StrapiResponse<T> = StrapiSuccessResponse<T> | StrapiErrorResponse;

export default StrapiResponse;
