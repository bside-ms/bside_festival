import { useCallback } from 'react';
import type { ReactElement } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { ApplicationType } from 'lib/ApplicationFormService';
import { useApplicationTypeTitles } from 'lib/ApplicationFormService';

interface Props {
    currentType: ApplicationType | undefined;
    onTypeChange: (type: ApplicationType) => void;
}

const ApplicationFormSelect = ({ currentType, onTypeChange }: Props): ReactElement => {

    const handleTypeChange = useCallback(
        (event: SelectChangeEvent) => {
            onTypeChange(event.target.value as ApplicationType);
        },
        [onTypeChange]
    );

    const applicationTypeTitles = useApplicationTypeTitles();

    return (
        <FormControl fullWidth={true}>
            <InputLabel sx={{ color: 'white' }}>Bewerbungstyp</InputLabel>
            <Select
                label="Bewerbungstyp"
                onChange={handleTypeChange}
                value={currentType ?? ''}
                sx={{
                    // background: 'transparent',
                    // borderColor: 'white',
                    // color: 'white',
                    // outline: 'white',
                }}
            >
                {Array.from(applicationTypeTitles).map(([type, title]) => (
                    <MenuItem key={type} value={type}>{title}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ApplicationFormSelect;
