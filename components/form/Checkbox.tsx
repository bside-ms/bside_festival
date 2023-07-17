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
}

const Checkbox = <T extends FieldValues>({ label, name, info, required = false }: Props<T>): ReactElement => {

    const { formState: { errors, isSubmitting }, register } = useFormContext();

    const isMounted = useIsMounted();
    const id = useMemo(
        () => isMounted ? uniqueId(name) : undefined,
        [isMounted, name]
    );

    const errorMessage = errors[name]?.message;

    return (
        <div className="flex items-center gap-2 px-3">
            <input
                id={id}
                type="checkbox"
                required={required}
                disabled={isSubmitting}
                className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                {...register(
                    name,
                    {
                        required: {
                            value: required,
                            message: 'Dies ist ein Pflichtfeld',
                        },
                    },
                )}
            />

            <label htmlFor={id} className="text-md font-medium text-gray-900 cursor-pointer">
                {required ? `${label} *` : label}
            </label>

            {isNotEmptyString(info) && (
                <label htmlFor={id} className="px-1 text-black text-base">
                    {info}
                </label>
            )}

            {typeof errorMessage === 'string' && (
                <div className="px-1 text-rose-900">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default Checkbox;
