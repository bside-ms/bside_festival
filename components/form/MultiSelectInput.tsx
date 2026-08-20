'use client';

import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import useIsMounted from '@/lib/common/hooks/useIsMounted';
import { uniqueId } from 'lodash';
import { ReactElement, useMemo } from 'react';
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
    const {
        formState: { errors },
        control,
    } = useFormContext<T>();

    const isMounted = useIsMounted();
    const id = useMemo(() => (isMounted ? uniqueId(name) : undefined), [isMounted, name]);

    const errorMessage = errors[name]?.message;

    return (
        <div>
            {isNotEmptyString(info) && (
                <label htmlFor={id} className="px-1 text-base">
                    {info}
                </label>
            )}

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
                        inputId={id}
                        formatCreateLabel={(inputValue: string) => `„${inputValue}” hinzufügen`}
                        placeholder={label}
                        noOptionsMessage={() => 'Keine weiteren Optionen, tippt neue ein'}
                        classNames={{
                            control: () => '!border-black !bg-white',
                        }}
                    />
                )}
            />

            {typeof errorMessage === 'string' && <div className="px-1 text-pink-300">{errorMessage}</div>}
        </div>
    );
};

export default MultiSelectInput;
