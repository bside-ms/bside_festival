export default interface SearchResponse {
    results: Array<{
        id: number;
        title: string;
        type: string;
        url: string;
        description: string;
        datetime: string;
    }>;
    total_count: number;
    offset: number;
    limit: number;
}
