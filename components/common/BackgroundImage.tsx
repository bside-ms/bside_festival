import Image from 'next/image';
import type { ReactElement } from 'react';
import cleanBackground from 'images/cleanBackground2025.webp';

const BackgroundImage = (): ReactElement => {
    return (
        <Image
            src={cleanBackground}
            alt="Hintergrund"
            className="absolute z-0 object-cover object-left blur-xs brightness-50"
            fill={true}
            priority={true}
        />
    );
};

export default BackgroundImage;
