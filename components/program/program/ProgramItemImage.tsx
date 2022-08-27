import type { ReactElement } from 'react';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type GenericImagesData from 'lib/strapi/typings/GenericImagesData';
import type { GenericImagesAttributes } from 'lib/strapi/typings/GenericImagesData';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
}

const getImageUrl = (images: GenericImagesData['data'], size: keyof GenericImagesAttributes['formats']): string | null => {

    const imageUrl = images?.[0]?.attributes.formats[size]?.url ?? images?.[0]?.attributes.url ?? null;

    if (imageUrl === null) {
        return null;
    }

    return `https://cms.b-side.ms${imageUrl}`;
};

const ProgramItemImage = ({ programItem }: Props): ReactElement => {

    const { artistImages } = getDetailsFromProgramItem(programItem);

    const thumbnailUrl = getImageUrl(artistImages, 'thumbnail');
    const imageUrl = getImageUrl(artistImages, 'small');

    return (
        <div>
            <div
                className="w-[150px] h-full bg-center bg-cover md:hidden"
                style={{ backgroundImage: thumbnailUrl === null ? undefined : `url(${thumbnailUrl}` }}
            />
            <div
                className="w-[250px] h-full bg-center bg-cover hidden md:block"
                style={{ backgroundImage: imageUrl === null ? undefined : `url(${imageUrl}` }}
            />
        </div>
    );
};

export default ProgramItemImage;
