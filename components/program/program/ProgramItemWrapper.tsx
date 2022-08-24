import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
    children: ReactNode;
}

const ProgramItemWrapper = ({ programItem, children }: Props): ReactElement => {

    const { artistId, applicationType } = getDetailsFromProgramItem(programItem);

    if (artistId === null) {
        return (
            <div className="relative grow h-[120px] md:h-[250px]">
                {children}
            </div>
        );
    }

    const url = `/kuenstler/${applicationType}/${artistId}`;

    return (
        <Link href={url}>
            <a className="block cursor-pointer relative grow h-[120px] md:h-[250px]">
                {children}
            </a>
        </Link>
    );
};

export default ProgramItemWrapper;
