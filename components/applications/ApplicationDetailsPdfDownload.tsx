import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import type { ReactElement } from 'react';
import type ApplicationDataRow from 'lib/application-form/ApplicationDataRow';

interface Props {
    titleData?: ApplicationDataRow;
    data: ApplicationDataRow;
}

const ApplicationDetailsPdfDownload = ({ titleData, data: { label, value } }: Props): ReactElement => {

    const title = titleData?.value ?? '';

    const fileName = `B-Side Festival 2022 - ${title.slice(0, 50)} - Technical Rider.pdf`;

    return (
        <Button
            startIcon={<FontAwesomeIcon icon={faFilePdf} />}
            href={value}
            download={fileName}
            size="small"
            variant="outlined"
            target="_blank"
        >
            {label}
        </Button>
    );
};

export default ApplicationDetailsPdfDownload;
