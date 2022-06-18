import type { ReactElement } from 'react';
import { ImageBlock } from 'lib/editorJs/Block';

interface Props {
    data: ImageBlock['data'];
}

const ImageBlock = ({ data: { file, caption } }: Props): ReactElement => {

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL!;

    const {
        url: mdUrl,
        height: mdHeight,
        width: mdWidth,
        alt,
        formats: {
            small: {
                url: smUrl,
                height: smHeight,
                width: smWidth,
            },
        },
    } = file;

    return (
        <div>
            <div className="md:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${baseUrl}${smUrl}`} height={smHeight} width={smWidth} alt={alt} title={alt} />
            </div>
            <div className="hidden md:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${baseUrl}${mdUrl}`} height={mdHeight} width={mdWidth} alt={alt} title={alt} />
            </div>
            <div className="italic mt-1 text-sm text-gray-600">{caption}</div>
        </div>
    );
};

export default ImageBlock;
