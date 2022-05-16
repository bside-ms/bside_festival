import styles from './ApplicationForm.module.scss';

import Link from 'next/link';
import type { ReactElement } from 'react';
import { ArrowBackIosNew } from '@mui/icons-material';
import ApplicationFormConfirmationOverlay from 'components/application-form/ApplicationFormConfirmationOverlay';
import ApplicationFormContextProvider from 'components/application-form/ApplicationFormContextProvider';
import ApplicationFormDisclaimer from 'components/application-form/ApplicationFormDisclaimer';
import ApplicationFormError from 'components/application-form/ApplicationFormError';
import ApplicationFormFields from 'components/application-form/ApplicationFormFields';
import ApplicationFormInformation from 'components/application-form/ApplicationFormInformation';
import ApplicationFormSubmitButton from 'components/application-form/ApplicationFormSubmitButton';
import ApplicationFormWrapper from 'components/application-form/ApplicationFormWrapper';
import ContentWrapper from 'components/ContentWrapper';
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

            <div className={`${styles.header} font-display`}>
                <ContentWrapper>
                    <div className="text-2xl">
                        Bewerbung für
                    </div>
                    <div className="text-4xl">
                        {title}
                    </div>
                </ContentWrapper>
            </div>

            <div className={styles.form}>
                <ContentWrapper>
                    <div className={styles.backArrow}>
                        <Link href="/bewerbung">
                            <a>
                                <ArrowBackIosNew sx={{ fontSize: 14 }} /> zurück zur Übersicht
                            </a>
                        </Link>
                    </div>

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

                            <ApplicationFormError />

                            <div className="mt-4 mb-8">
                                <ApplicationFormSubmitButton />
                            </div>

                            <ApplicationFormConfirmationOverlay />
                        </ApplicationFormWrapper>
                    </ApplicationFormContextProvider>

                    {showDisclaimer && <ApplicationFormDisclaimer />}
                </ContentWrapper>
            </div>
        </>
    );
};

export default ApplicationForm;
