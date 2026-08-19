import createPutObjectCommand from '@/lib/upload/createPutObjectCommand';
import createS3Client from '@/lib/upload/createS3Client';

const putObjectToIonos = async (fileName: string, contentType: string, buffer: Buffer): Promise<void> => {
    const s3Client = createS3Client();
    const putObjectCommand = createPutObjectCommand(fileName, contentType, buffer);
    const output = await s3Client.send(putObjectCommand);

    if (output.$metadata.httpStatusCode !== 200) {
        throw new Error(`Error while uploading file, ${JSON.stringify(output)}`);
    }
};

export default putObjectToIonos;
