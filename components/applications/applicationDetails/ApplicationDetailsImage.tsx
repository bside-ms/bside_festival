import { useCallback, useState } from 'react';
import Image from 'next/image';
import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsImage = ({ application: { imageFileName, name } }: Props): ReactElement | null => {
    const [showEnhancedImage, setShowEnhancedImage] = useState(false);
    const toggleEnhancedImage = useCallback(() => setShowEnhancedImage((prevState) => !prevState), []);

    if (isEmptyString(imageFileName)) {
        return null;
    }

    const imageUrl = createPublicObjectUrl(imageFileName);

    return (
        <div className={`${showEnhancedImage ? 'h-96 md:h-[600px]' : ''} relative mb-2 h-32 w-full overflow-hidden rounded-md md:h-52`}>
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${imageUrl})` }} />

            <Image src={imageUrl} alt={name} fill={true} className="object-contain backdrop-blur-2xl" onClick={toggleEnhancedImage} />
        </div>
    );
};

export default ApplicationDetailsImage;
