'use client';

import cn from '@/lib/common/helper/cn';
import isEmptyNumber from '@/lib/common/helper/isEmptyNumber';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import useIsMounted from '@/lib/common/hooks/useIsMounted';
import { uniqueId } from 'lodash';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

interface Props<T extends FieldValues> {
    name: FieldPath<T>;
    label?: string;
    defaultValue?: string;
    info?: string;
    additionalInfo?: string;
    required?: boolean;
    maxLength?: number;
    max?: number;
    min?: number;
    validate?: (value: string) => string | undefined;
    isDisabled?: boolean;
    type?: string;
    placeholder?: string;
}

const TextInput = <T extends FieldValues>({
    label,
    name,
    defaultValue,
    info,
    type = 'text',
    additionalInfo,
    validate,
    required = false,
    maxLength,
    max,
    min,
    isDisabled,
    placeholder,
}: Props<T>): ReactElement => {
    const {
        formState: { errors, isSubmitting },
        register,
    } = useFormContext();

    const isMounted = useIsMounted();
    const id = useMemo(() => (isMounted ? uniqueId(name) : undefined), [isMounted, name]);

    const errorMessage = errors[name]?.message;

    return (
        <div className="flex flex-col">
            {isNotEmptyString(info) && (
                <label htmlFor={id} className="px-1 text-base">
                    {info}
                    {required ? <span aria-hidden="true"> *</span> : null}
                </label>
            )}

            <input
                id={id}
                type={type}
                defaultValue={defaultValue}
                className={cn(
                    'rounded border border-black bg-white p-2 outline-0 placeholder:opacity-55',
                    typeof errorMessage === 'string' && 'bg-rose-400',
                )}
                required={required}
                max={max}
                min={min}
                placeholder={
                    placeholder ?? (isNotEmptyString(info) ? (info === label ? undefined : label) : required ? `${label} *` : label)
                }
                disabled={isSubmitting || isDisabled}
                {...register(name, {
                    required: {
                        value: required,
                        message: 'Dies ist ein Pflichtfeld',
                    },
                    valueAsNumber: type === 'number',
                    maxLength: isEmptyNumber(maxLength)
                        ? undefined
                        : {
                              value: maxLength,
                              message: `Max. ${maxLength} Zeichen`,
                          },
                    validate,
                })}
            />

            {isNotEmptyString(additionalInfo) && <div className="px-1 pt-1 text-xs">{additionalInfo}</div>}

            {typeof errorMessage === 'string' && <div className="px-1 text-rose-600">{errorMessage}</div>}
        </div>
    );
};

export default TextInput;
