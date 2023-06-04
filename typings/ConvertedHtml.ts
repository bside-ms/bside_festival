import type { MJMLJsonObject, MJMLParseError } from 'mjml-core';

export default interface ConvertedHtml {
    html: string;
    json?: MJMLJsonObject;
    errors?: Array<MJMLParseError>;
}
