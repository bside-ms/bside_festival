import { Checkbox } from '@mui/material';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { useVolunteerFormContext } from 'components/volunteers/VolunteerFormContext';

const VolunteerFormPrivacyTermsCheckbox = (): ReactElement => {

    const { isSubmitting } = useVolunteerFormContext();

    const name = 'privacyTerms';

    const privacyTermsLink = (
        <Link href="https://b-side.ms/datenschutzerklaerung">
            <a target="_blank" className="underline">
                Datenschutz&shy;bestimmungen
            </a>
        </Link>
    );

    return (
        <div className="flex">
            <div>
                <Checkbox
                    id={name}
                    required={true}
                    sx={{ paddingY: 0, paddingX: 1 }}
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label htmlFor={name}>
                    Hiermit akzeptiere ich die {privacyTermsLink} *
                </label>
            </div>
        </div>
    );
};

export default VolunteerFormPrivacyTermsCheckbox;
