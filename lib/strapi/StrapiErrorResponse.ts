export default interface StrapiErrorResponse {
    data: null;
    error: {
        status: number;
        name: string;
        message: string;
    };
}
