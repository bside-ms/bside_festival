import type { Participant } from '@prisma/client';
import Link from 'next/link';
import type { ReactElement } from 'react';
import generateSlug from 'lib/common/helper/generateSlug';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import typeLabels from 'lib/participants/typeLabels';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';

interface Props {
    application: Participant;
    searchText: string | null;
}

const Application = ({ application: { id, name, type, imageFileName }, searchText }: Props): ReactElement => {

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);

    const link = isEmptyString(searchText)
        ? `/bewerbungen/${id}-${generateSlug(name)}`
        : `/bewerbungen/${id}-${generateSlug(name)}?search=${searchText}`;

    return (
        <Link href={link}>
            <div className="p-3 rounded-md shadow-lg relative text-gray-800 md:cursor-pointer md:hover:bg-gray-100">
                {isNotEmptyString(imageUrl) && (
                    <div
                        className="w-full h-32 md:h-52 relative rounded-md overflow-hidden mb-2"
                    >
                        <div
                            className="bg-center bg-cover bg-no-repeat absolute top-0 right-0 bottom-0 left-0"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                        <div
                            className="bg-center bg-contain backdrop-blur-2xl bg-no-repeat absolute top-0 right-0 bottom-0 left-0"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                    </div>
                )}

                <div className="uppercase text-sm text-gray-600">{typeLabels[type]}</div>

                <div className="text-xl">{name}</div>
            </div>
        </Link>
    );
};

export default Application;
