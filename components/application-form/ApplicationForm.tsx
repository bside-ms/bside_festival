import styles from './ApplicationForm.module.scss';

import { Button } from '@mui/material';
import type { ReactElement } from 'react';
import ApplicationFormContextProvider from 'components/application-form/ApplicationFormContextProvider';
import ApplicationFormDisclaimer from 'components/application-form/ApplicationFormDisclaimer';
import ApplicationFormFields from 'components/application-form/ApplicationFormFields';
import ApplicationFormInformation from 'components/application-form/ApplicationFormInformation';
import ApplicationFormWrapper from 'components/application-form/ApplicationFormWrapper';
import PageHeader from 'components/PageHeader';
import type ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationTitle from 'lib/application-form/useApplicationTitle';
import useShowApplicationFormDisclaimer from 'lib/application-form/useShowApplicationFormDisclaimer';

interface Props {
    applicationType: ApplicationType;
}

const ApplicationForm = ({ applicationType }: Props): ReactElement => {

    const showDisclaimer = useShowApplicationFormDisclaimer(applicationType);
    const title = useApplicationTitle(applicationType);

    return (
        <>
            <PageHeader theme="pink" />

            <div className={styles.header}>
                <div className="text-2xl font-display">
                    Bewerbung für
                </div>
                <div className="text-4xl font-display">
                    {title}
                </div>
            </div>

            <div className={styles.form}>
                <div className="mb-4 space-y-2 text-[#3a1a85]">
                    <div className="font-bold">
                        Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!
                    </div>
                    <div>
                        Die Bewerbungsphase für das B-Side Festival 2022 ist eröffnet.
                    </div>

                    <ApplicationFormInformation applicationType={applicationType} />
                </div>

                <ApplicationFormContextProvider applicationType={applicationType}>
                    <ApplicationFormWrapper>
                        <input type="hidden" name="applicationType" value={applicationType} />

                        <ApplicationFormFields currentApplicationType={applicationType} />

                        <div className="mt-4">
                            <Button type="submit" variant="contained">
                                Bewerbung absenden
                            </Button>
                        </div>
                    </ApplicationFormWrapper>
                </ApplicationFormContextProvider>

                {showDisclaimer && <ApplicationFormDisclaimer />}
            </div>
        </>
    );
};

export default ApplicationForm;
