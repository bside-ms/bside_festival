import Link from 'next/link';
import type { ReactElement } from 'react';
import type ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationTitle from 'lib/application-form/useApplicationTitle';

interface Props {
    applicationType: ApplicationType;
}

const ApplicationTypeCard = ({ applicationType }: Props): ReactElement => {

    const title = useApplicationTitle(applicationType);

    return (
        <div className="mb-3">
            <Link href={`/bewerbung/${applicationType}`} passHref={true}>
                <a>
                    <div>
                        {title}
                    </div>
                </a>
            </Link>
        </div>
    );
};

export default ApplicationTypeCard;
