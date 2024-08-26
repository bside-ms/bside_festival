import { useMemo } from 'react';
import { uniqueId } from 'lodash';
import type { ReactElement } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import useIsMounted from 'lib/common/hooks/useIsMounted';

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
        <div className="flex items-center gap-2 px-3">
            <input
                id={id}
                type="checkbox"
                required={required}
                disabled={isSubmitting}
                defaultChecked={initiallyChecked}
                className="size-4 cursor-pointer rounded border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-500"
                {...register(name, {
                    required: {
                        value: required,
                        message: 'Dies ist ein Pflichtfeld',
                    },
                })}
            />

            <label htmlFor={id} className="cursor-pointer text-base font-medium ">
                {required ? `${label} *` : label}
            </label>

            {isNotEmptyString(info) && (
                <label htmlFor={id} className="px-1 text-base text-black">
                    {info}
                </label>
            )}

            {typeof errorMessage === 'string' && <div className="px-1 text-rose-900">{errorMessage}</div>}
        </div>
    );
};

export default Checkbox;
