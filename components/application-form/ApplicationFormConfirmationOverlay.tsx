import { Check } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Link from 'next/link';
import type { ReactElement } from 'react';
import useApplicationFormContext from 'lib/application-form/useApplicationFormContext';

const ApplicationFormConfirmationOverlay = (): ReactElement => {

    const { wasSuccessfullySubmitted } = useApplicationFormContext();

    return (
        <Dialog open={wasSuccessfullySubmitted}>
            <DialogTitle>
                <Check className="text-green-600 mr-1" fontSize="large" />
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
