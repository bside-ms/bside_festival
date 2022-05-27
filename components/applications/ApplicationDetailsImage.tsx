import type { ReactElement } from 'react';
import type ApplicationDataRow from 'lib/application-form/ApplicationDataRow';

interface Props {
    data: ApplicationDataRow;
}

const ApplicationDetailsImage = ({ data: { label, value } }: Props): ReactElement => {

    return (
        <div className="md:w-2/3">
            <div className="underline">{label}</div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} />
        </div>
    );
};

export default ApplicationDetailsImage;
