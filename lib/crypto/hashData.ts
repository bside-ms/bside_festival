import { Buffer } from 'buffer';
import crypto from 'crypto';
import hashAlgorithm from 'lib/crypto/hashAlgorithm';
import process from 'process';

const hashData = (data: string): string => {
    return crypto
        .createHmac(hashAlgorithm, Buffer.from(process.env.CRYPTO_SECRET ?? ''))
        .update(Buffer.from(data))
        .digest()
        .toString('hex');
};

export default hashData;
