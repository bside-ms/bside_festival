'use client';

import type { ReactElement } from 'react';
import { Controller, type FieldPath, type FieldValues, useFormContext } from 'react-hook-form';
import type { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface LabelOption {
    value: number | string; // Will be string, when new label
    label: string;
}

interface Props<T extends FieldValues> {
    name: FieldPath<T>;
    label?: string;
    info?: string;
    defaultOptions?: Array<{ id: number; label: string }>;
    options: Array<{ id: number; label: string }>;
}

const MultiSelectInput = <T extends FieldValues>({ name, label, info, options, defaultOptions }: Props<T>): ReactElement => {
    const { control } = useFormContext<T>();

    return (
        <div>
            <div className="text-white">{info}</div>

            {/* eslint-disable react/jsx-no-bind */}
            <Controller<T>
                control={control}
                name={name}
                // @ts-expect-error | Currently too late to find a good solution
                defaultValue={defaultOptions?.map(({ id }) => id)}
                render={({ field: { ref, onChange } }): ReactElement => (
                    <CreatableSelect
                        ref={ref}
                        onChange={(newValues: MultiValue<LabelOption>): void => onChange(newValues.map(({ value }) => value))}
                        defaultValue={defaultOptions?.map<LabelOption>(({ id, label }) => ({
                            value: id,
                            label,
                        }))}
                        isMulti={true}
                        options={options.map<LabelOption>(({ id, label }) => ({
                            value: id,
                            label,
                        }))}
                        formatCreateLabel={(inputValue: string) => `„${inputValue}” hinzufügen`}
                        placeholder={label}
                        noOptionsMessage={() => 'Keine Auswahl verfügbar'}
                        classNames={{
                            control: () => '!bg-transparent !border-white',
                            placeholder: () => '!text-white/55',
                        }}
                    />
                )}
            />
        </div>
    );
};

export default MultiSelectInput;
