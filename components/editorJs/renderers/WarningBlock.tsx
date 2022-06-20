import { Alert, AlertTitle } from '@mui/material';
import type { ReactElement } from 'react';
import { WarningBlock } from 'lib/editorJs/Block';

interface Props {
    data: WarningBlock['data'];
}

const WarningBlock = ({ data: { title, message } }: Props): ReactElement => {

    return (
        <Alert severity="warning">
            <AlertTitle>{title}</AlertTitle>
            {message}
        </Alert>
    );
};

export default WarningBlock;
