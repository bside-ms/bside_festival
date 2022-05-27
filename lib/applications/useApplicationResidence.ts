
const useApplicationResidence = (data: Record<string, string>): string | null => {

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return data.residence ?? null;
};

export default useApplicationResidence;
