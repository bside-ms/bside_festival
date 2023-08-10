import { useCallback, useState } from 'react';
import Image from 'next/image';
import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const DetailImage = ({ application: { imageFileName, name } }: Props): ReactElement | null => {

    const [showEnhancedImage, setShowEnhancedImage] = useState(false);
    const toggleEnhancedImage = useCallback(() => setShowEnhancedImage(prevState => !prevState), []);

    if (isEmptyString(imageFileName)) {
        return null;
    }

    const imageUrl = createPublicObjectUrl(imageFileName);

    return (
        <div
            className={`${showEnhancedImage ? 'h-96 md:h-[600px]' : ''} w-full h-32 md:h-52 relative rounded-md overflow-hidden mb-2`}
        >
            <div
                className="bg-center bg-cover bg-no-repeat absolute top-0 right-0 bottom-0 left-0"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            <Image
                src={imageUrl}
                alt={name}
                fill={true}
                className="object-contain backdrop-blur-2xl"
                onClick={toggleEnhancedImage}
            />
        </div>
    );
};

export default DetailImage;
