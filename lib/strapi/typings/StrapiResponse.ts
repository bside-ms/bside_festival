import type StrapiErrorResponse from 'lib/strapi/typings/StrapiErrorResponse';
import type StrapiSuccessResponse from 'lib/strapi/typings/StrapiSuccessResponse';

type StrapiResponse<T> = StrapiSuccessResponse<T> | StrapiErrorResponse;

export default StrapiResponse;
