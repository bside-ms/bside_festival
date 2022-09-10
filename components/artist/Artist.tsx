import styles from './Artist.module.scss';

import { Fragment } from 'react';
import { isNil } from 'lodash';
import type { ReactElement } from 'react';
import ArtistDescription from 'components/artist/ArtistDescription';
import ArtistEditButton from 'components/artist/ArtistEditButton';
import ArtistLinks from 'components/artist/ArtistLinks';
import ArtistName from 'components/artist/ArtistName';
import ArtistProgram from 'components/artist/ArtistProgram';
import ArtistProgramEditButton from 'components/artist/ArtistProgramEditButton';
import ArtistShareLink from 'components/artist/ArtistShareLink';
import ArtistUnpublishedTag from 'components/artist/ArtistUnpublishedTag';
import RegistrationWrapper from 'components/artist/registration/RegistrationWrapper';
import Button from 'components/common/Button';
import getImageUrl from 'lib/strapi/getImageUrl';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

interface Props {
    artist: ArtistModel;
    applicationType: string;
    strapiCollectionType: StrapiCollectionType;
    onCloseClick?: () => void;
    programItems?: Array<ProgramItem | FullTimeProgramItem>;
}

const Artist = ({ artist, applicationType, strapiCollectionType, onCloseClick, programItems }: Props): ReactElement => {

    const imageRelativeUrl = getImageUrl(artist, false, 'medium');
    const imageUrl = imageRelativeUrl === null ? null : `https://cms.b-side.ms${imageRelativeUrl}`;

    return (
        <div key={artist.id} className={`space-y-3 relative z-50 ${styles.artist ?? ''}`}>
            <div className="flex flex-col md:space-x-4 md:flex-row z-50 relative bg-white">
                {imageUrl !== null && (
                    <div
                        className="h-[400px] w-full md:min-h-[500px] md:shrink-0 md:w-1/3 bg-center bg-cover"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                )}

                <div className="p-4 space-y-3 z-50 relative">
                    <ArtistUnpublishedTag artist={artist} />

                    <ArtistEditButton artist={artist} strapiCollectionType={strapiCollectionType} />

                    {!isNil(programItems) && (
                        programItems.map(programItem => (
                            <ArtistProgramEditButton
                                key={programItem.id}
                                programItem={programItem}
                            />
                        ))
                    )}

                    <ArtistName artist={artist} />

                    <ArtistDescription artist={artist} />

                    {!isNil(programItems) && (
                        programItems.map(programItem => (
                            <Fragment key={programItem.id}>
                                <ArtistProgram programItem={programItem} />

                                <RegistrationWrapper programItem={programItem} />
                            </Fragment>
                        ))
                    )}

                    <ArtistLinks artist={artist} />

                    {onCloseClick !== undefined ? (
                        <>
                            <div className="my-4 md:hidden">
                                <Button onClick={onCloseClick} withFullWidth={true}>
                                    Zurück zum Programm
                                </Button>
                            </div>

                            <div className="text-center md:text-left text-lg pt-3 md:pt-0">
                                <ArtistShareLink artist={artist} applicationType={applicationType} />
                            </div>
                        </>
                    ) : (
                        <div className="text-lg">
                            <ArtistShareLink artist={artist} applicationType={applicationType} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Artist;
