import type { ReactElement } from 'react';
import type ApplicationDataRow from 'lib/application-form/ApplicationDataRow';

interface Props {
    data: ApplicationDataRow;
}

const ApplicationDetailsText = ({ data: { label, value } }: Props): ReactElement => {

    return (
        <>
            <div className="underline">{label}</div>
            <div>
                {value.split(/\n/).map(
                    // eslint-disable-next-line react/no-array-index-key
                    (line, index) => <div key={index}>{line}</div>
                )}
            </div>
        </>
    );
};

export default ApplicationDetailsText;
