
const useApplicationResidence = (data: Record<string, string>): string | null => {

    return data.residence ?? null;
};

export default useApplicationResidence;
