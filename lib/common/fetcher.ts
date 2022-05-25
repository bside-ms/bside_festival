// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetcher = async (url: string): Promise<any> => {

    return (await fetch(url)).json();
};

export default fetcher;
