import styles from './VolunteerForm.module.scss';

import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import PageHeader from 'components/common/PageHeader';
import VolunteerContactFields from 'components/volunteers/VolunteerContactFields';
import VolunteerFormConfirmationOverlay from 'components/volunteers/VolunteerFormConfirmationOverlay';
import { VolunteerFormContextProvider } from 'components/volunteers/VolunteerFormContext';
import VolunteerFormError from 'components/volunteers/VolunteerFormError';
import VolunteerFormPreferencesFields from 'components/volunteers/VolunteerFormPreferencesFields';
import VolunteerFormPrivacyTermsCheckbox from 'components/volunteers/VolunteerFormPrivacyTermsCheckbox';
import VolunteerFormSubmitButton from 'components/volunteers/VolunteerFormSubmitButton';
import VolunteerFormThemeProvider from 'components/volunteers/VolunteerFormThemeProvider';
import VolunteerFormWrapper from 'components/volunteers/VolunteerFormWrapper';

const VolunteerForm = (): ReactElement => {

    return (
        <>
            <PageHeader theme="pink" />

            <div className={`${styles.header ?? ''} font-display`}>
                <ContentWrapper>
                    <div className="text-2xl">
                        Helfer:innen
                    </div>
                </ContentWrapper>
            </div>

            <div className={styles.form}>
                <ContentWrapper>
                    <div className="mb-4 space-y-2 text-[#3a1a85]">
                        <div className="font-bold">
                            Um einen Überblick über eure Stärken und Interessen zu bekommen,
                            haben wir folgenden Fragebogen vorbereitet. Kreuzt bitte an,
                            was auf euch zutrifft. Außerdem hinterlasst bitte eure Kontaktdaten,
                            sodass wir euch erreichen können. Danke!
                        </div>
                    </div>

                    <VolunteerFormThemeProvider>
                        <VolunteerFormContextProvider>
                            <VolunteerFormWrapper>
                                <VolunteerContactFields />

                                <VolunteerFormPreferencesFields />

                                <VolunteerFormPrivacyTermsCheckbox />

                                <VolunteerFormError />

                                <div className="mt-4 mb-8">
                                    <VolunteerFormSubmitButton />
                                </div>

                                <VolunteerFormConfirmationOverlay />
                            </VolunteerFormWrapper>
                        </VolunteerFormContextProvider>
                    </VolunteerFormThemeProvider>
                </ContentWrapper>
            </div>
        </>
    );
};

export default VolunteerForm;
