import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

const ApplicationFormConfirmationOverlay = (): ReactElement => {

    const { wasSuccessfullySubmitted } = useApplicationFormContext();

    return (
        <Dialog open={wasSuccessfullySubmitted}>
            <DialogTitle>
                <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2 text-3xl align-text-bottom" />
                Das hat geklappt!
            </DialogTitle>

            <DialogContent>
                Schön, dass du dieses Jahr beim Festival dabei sein möchtest! Wir prüfen deine
                Bewerbung bald und melden uns dann!
            </DialogContent>

            <DialogActions>
                <Link href="/" passHref={true}>
                    <Button variant="outlined">Okay</Button>
                </Link>
            </DialogActions>
        </Dialog>
    );
};

export default ApplicationFormConfirmationOverlay;
