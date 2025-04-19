'use client';

import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import useIsMounted from 'lib/common/hooks/useIsMounted';
import { uniqueId } from 'lodash';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

interface Props<T extends FieldValues> {
    name: FieldPath<T>;
    label: string;
    info?: string;
    required?: boolean;
    initiallyChecked?: boolean;
}

const Checkbox = <T extends FieldValues>({ label, name, info, required = false, initiallyChecked = false }: Props<T>): ReactElement => {
    const {
        formState: { errors, isSubmitting },
        register,
    } = useFormContext();

    const isMounted = useIsMounted();
    const id = useMemo(() => (isMounted ? uniqueId(name) : undefined), [isMounted, name]);

    const errorMessage = errors[name]?.message;

    return (
        <div className="px-3">
            <div className="flex items-baseline gap-2">
                <input
                    id={id}
                    type="checkbox"
                    required={required}
                    disabled={isSubmitting}
                    defaultChecked={initiallyChecked}
                    className="size-3 shrink-0 cursor-pointer rounded border-gray-300 bg-gray-100 pt-3 leading-3 focus:ring-2 focus:ring-blue-500"
                    {...register(name, {
                        required: {
                            value: required,
                            message: 'Dies ist ein Pflichtfeld',
                        },
                    })}
                />

                <label htmlFor={id} className="cursor-pointer text-base font-medium text-white">
                    {required ? `${label} *` : label}
                </label>
            </div>

            {isNotEmptyString(info) && (
                <label htmlFor={id} className="text-base text-white">
                    {info}
                </label>
            )}

            {typeof errorMessage === 'string' && <div className="text-rose-600">{errorMessage}</div>}
        </div>
    );
};

export default Checkbox;
