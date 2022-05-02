import { Button } from '@mui/material';
import Link from 'next/link';
import type { ReactElement } from 'react';
import ApplicationFormDisclaimer from 'components/application-form/ApplicationFormDisclaimer';
import ApplicationFormFields from 'components/application-form/ApplicationFormFields';
import ApplicationFormInformation from 'components/application-form/ApplicationFormInformation';
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
        <div className="w-full p-2 mx-2 my-4">
            <div className="text-gray-400">
                <Link href="/bewerbung" passHref={true}>
                    <a>« zurück zur Übersicht</a>
                </Link>
            </div>

            <div className="text-2xl">
                Bewerbung für
            </div>
            <div className="font-bold text-4xl">
                {title}
            </div>

            <div className="my-4">
                <div className="font-bold">
                    Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!
                </div>
                <div>
                    Die Bewerbungsphase für das B-Side Festival 2022 ist eröffnet.
                </div>
            </div>

            <div className="my-4 space-y-3">
                <ApplicationFormInformation applicationType={applicationType} />
            </div>

            <form action="/application-form/submit" method="post">
                <ApplicationFormFields currentApplicationType={applicationType} />

                <div className="mt-4">
                    <Button type="submit" variant="contained">
                        Bewerbung absenden
                    </Button>
                </div>
            </form>

            {showDisclaimer && <ApplicationFormDisclaimer />}
        </div>
    );
};

export default ApplicationForm;
