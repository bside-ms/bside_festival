import { useCallback } from 'react';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import Modal from 'react-modal';
import Artist from 'components/artist/Artist';
import { useProgramContext } from 'components/program/program/ProgramContext';
import getCollectionTypeFromApplicationType from 'lib/program/getCollectionTypeFromApplicationType';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';

const ArtistModal = (): ReactElement | null => {

    const { programItemForModal, setProgramItemForModal } = useProgramContext();

    const handleClose = useCallback(() => setProgramItemForModal(null), [setProgramItemForModal]);

    if (programItemForModal === null) {
        return null;
    }

    const { applicationType, artist } = getDetailsFromProgramItem(programItemForModal);

    const collectionType = getCollectionTypeFromApplicationType(applicationType);

    if (artist === null) {
        return null;
    }

    return (
        <Modal
            className="z-50"
            isOpen={true}
            onRequestClose={handleClose}
            ariaHideApp={false}
            preventScroll={true}
            style={{
                overlay: {
                    zIndex: '5000',
                    padding: '30px',
                    overflow: 'scroll',
                    backgroundColor: '#000000BB',
                },
                content: {},
            }}
        >
            <div className="flex justify-end" onClick={handleClose}>
                <div className="text-white rounded-full flex items-center justify-center text-4xl text-white cursor-pointer hover:text-gray-400 pb-4">
                    <FontAwesomeIcon icon={faTimesCircle} />
                </div>
            </div>

            <Artist
                artist={artist}
                strapiCollectionType={collectionType}
                onCloseClick={handleClose}
                programItems={[programItemForModal]}
                applicationType={applicationType}
            />
        </Modal>
    );
};

export default ArtistModal;
