import { Buffer } from 'buffer';

interface ParsedEncodedFile {
    base64Data: string;
    buffer: Buffer;
    contentType: string;
}

const parseEncodedFile = (encodedFile: string): ParsedEncodedFile => {
    const fileEncodingMatch = /^data:([\w/]+);base64,/.exec(encodedFile);

    if (fileEncodingMatch === null || fileEncodingMatch[1] === undefined) {
        throw new Error(`Malformed file encoding, ${encodedFile.slice(0, 50)}...`);
    }

    const [match, contentType] = fileEncodingMatch;
    const base64Data = encodedFile.replace(match, '');

    return {
        base64Data,
        buffer: Buffer.from(base64Data, 'base64'),
        contentType,
    };
};

export default parseEncodedFile;
