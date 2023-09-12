const blobToDataUrl = (blob: Blob): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = (): void => resolve(reader.result);

        reader.readAsDataURL(blob);
    });
};

export default blobToDataUrl;
