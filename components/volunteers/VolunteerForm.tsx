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
import VolunteerPriorDates from 'components/volunteers/VolunteerPriorDates';

const VolunteerForm = (): ReactElement => {

    return (
        <>
            <PageHeader theme="pink" />

            <div className={`${styles.header ?? ''} font-display`}>
                <ContentWrapper>
                    <div className="text-2xl">
                        Mithelfen
                    </div>
                </ContentWrapper>
            </div>

            <div className={styles.form}>
                <ContentWrapper>
                    <div className="mb-4 space-y-2 text-[#3a1a85]">
                        <div>
                            In weniger als zwei Monaten geht es im Hansaviertel rund! Für unserer B-Side Festival 2022
                            „Zurück für die Zukunft“ brauchen wir euch! Wir suchen tatkräftige Helfer*innen. Dabei gibt
                            es verschiedene Aufgaben, bei denen ihr euch einbringen könnt: Die Betreuung von  Konzerten,
                            Workshops, Ausstellungen und Lesungen, die Verpflegung für das Helfer*innen- und B-Side-Team,
                            Hilfe beim Auf- und Abbau und der Technik des Festivals, Unterstützung des Awareness-Teams
                            auf dem gesamten Festival und beim Spendensammeln.
                        </div>
                        <div>
                            Mit allen Stärken und Interessen seid ihr herzlich willkommen uns zu unterstützen! Denn nur
                            mit euch kann das Festival so toll wie die letzten Jahre werden!
                        </div>
                        <div>
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

                                <VolunteerPriorDates />

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
