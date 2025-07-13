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
    label: string;
    defaultValue?: string;
    info?: string;
    required?: boolean;
    maxLength?: number;
    validate?: (value: string) => string | undefined;
}

const DateTimeInput = <T extends FieldValues>({
    label,
    name,
    defaultValue,
    info,
    validate,
    required = false,
    maxLength,
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
            <input
                id={id}
                type="datetime-local"
                className={cn(
                    'rounded border border-black p-2 outline-0 placeholder:opacity-55',
                    typeof errorMessage === 'string' && 'bg-rose-400',
                )}
                required={required}
                defaultValue={defaultValue}
                placeholder={required ? `${label} *` : label}
                disabled={isSubmitting}
                {...register(name, {
                    required: {
                        value: required,
                        message: 'Dies ist ein Pflichtfeld',
                    },
                    maxLength: isEmptyNumber(maxLength)
                        ? undefined
                        : {
                              value: maxLength,
                              message: `Max. ${maxLength} Zeichen`,
                          },
                    validate,
                })}
            />
            {isNotEmptyString(info) && (
                <label htmlFor={id} className="px-1 text-base">
                    {info}
                </label>
            )}

            {typeof errorMessage === 'string' && <div className="px-1 text-rose-600">{errorMessage}</div>}
        </div>
    );
};

export default DateTimeInput;
