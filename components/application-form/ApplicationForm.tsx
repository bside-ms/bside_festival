import { Button } from '@mui/material';
import type { ReactElement } from 'react';
import ApplicationFormContextProvider from 'components/application-form/ApplicationFormContextProvider';
import ApplicationFormDisclaimer from 'components/application-form/ApplicationFormDisclaimer';
import ApplicationFormFields from 'components/application-form/ApplicationFormFields';
import ApplicationFormInformation from 'components/application-form/ApplicationFormInformation';
import ApplicationFormWrapper from 'components/application-form/ApplicationFormWrapper';
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
        <div>
            <div className="text-2xl">
                Bewerbung für
            </div>
            <div className="font-bold text-4xl">
                {title}
            </div>

            <div className="my-4 space-y-2">
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
    );
};

export default ApplicationForm;
