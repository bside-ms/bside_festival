import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { useVolunteerFormContext } from 'components/volunteers/VolunteerFormContext';

const VolunteerFormConfirmationOverlay = (): ReactElement => {

    const { wasSuccessfullySubmitted } = useVolunteerFormContext();

    return (
        <Dialog open={wasSuccessfullySubmitted}>
            <DialogTitle>
                <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2 text-3xl align-text-bottom" />
                Danke für deine Nachricht!
            </DialogTitle>

            <DialogContent>
                Schön, dass du das B-Side Festival dieses Jahr unterstützen möchtest! Wir melden
                uns sehr bald wieder bei dir!
            </DialogContent>

            <DialogActions>
                <Link href="/" passHref={true}>
                    <Button variant="outlined">Okay</Button>
                </Link>
            </DialogActions>
        </Dialog>
    );
};

export default VolunteerFormConfirmationOverlay;
