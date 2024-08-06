/* eslint-disable react/jsx-no-bind */
import { useCallback } from 'react';
import type { Label } from '@prisma/client';
import type { ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import type { CurationFormValues } from 'components/applications/applicationCuration/ApplicationCurationForm';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';

interface LabelOption {
    value: number | string; // Will be string, when new label
    label: string;
}

interface Props {
    labels: Array<Label>;
}

const ApplicationCurationLabelSelect = ({ labels }: Props): ReactElement => {
    const { control } = useFormContext<CurationFormValues>();

    const { allLabels } = useApplicationsOverviewContext();

    const options = allLabels.map<LabelOption>(({ id, label }) => ({
        value: id,
        label,
    }));

    const defaultValue: MultiValue<LabelOption> = labels.map<LabelOption>(({ id, label }) => ({
        value: id,
        label,
    }));

    const renderCreateLabel = useCallback((inputValue: string) => `„${inputValue}” anlegen`, []);

    const renderNoOptionsLabel = useCallback(() => 'Keine Auswahl verfügbar', []);

    return (
        <div>
            <div>Labels</div>

            <div className="max-w-[350px]">
                <Controller<CurationFormValues>
                    control={control}
                    name="labels"
                    defaultValue={labels.map(({ id }) => id)}
                    render={({ field: { ref, onChange } }): ReactElement => (
                        <CreatableSelect
                            ref={ref}
                            onChange={(newValues: MultiValue<LabelOption>): void => onChange(newValues.map(({ value }) => value))}
                            defaultValue={defaultValue}
                            isMulti={true}
                            options={options}
                            formatCreateLabel={renderCreateLabel}
                            placeholder="Auswählen…"
                            noOptionsMessage={renderNoOptionsLabel}
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default ApplicationCurationLabelSelect;
