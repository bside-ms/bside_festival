import { Buffer } from 'buffer';
import crypto from 'crypto';
import process from 'process';
import hashAlgorithm from 'lib/crypto/hashAlgorithm';

const hashData = (data: string): string => {

    return crypto
        .createHmac(hashAlgorithm, Buffer.from(process.env.CRYPTO_SECRET ?? ''))
        .update(Buffer.from(data))
        .digest()
        .toString('hex');
};

export default hashData;
