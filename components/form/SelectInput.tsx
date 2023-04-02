import { useMemo } from 'react';
import { uniqueId } from 'lodash';
import type { ReactElement } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form/dist/types/errors';
import type { FieldValues } from 'react-hook-form/dist/types/fields';
import type { FieldPath } from 'react-hook-form/dist/types/path/eager';
import useIsMounted from 'lib/common/hooks/useIsMounted';

interface Props<T extends FieldValues> {
    name: FieldPath<T>;
    label: string;
    options: Array<{ value: string, label: string }>;
    required?: boolean;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
const SelectInput = <T extends FieldValues,>({ label, name, options, required = false, register, errors }: Props<T>): ReactElement => {

    const isMounted = useIsMounted();
    const id = useMemo(
        () => isMounted ? uniqueId(name) : undefined,
        [isMounted, name]
    );

    const errorMessage = errors[name]?.message;

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id}>
                {label} {required && <span className="text-orange-600">*</span>}
            </label>

            <select
                id={id}
                className="border border-gray-700 p-1 rounded bg-white py-2"
                required={required}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register(
                    name,
                    {
                        required: {
                            value: required,
                            message: 'Dies ist ein Pflichtfeld',
                        },
                    }
                )}
            >
                {options.map(({ label: optionLabel, value }) => (
                    <option key={value} value={value}>
                        {optionLabel}
                    </option>
                ))}
            </select>

            {typeof errorMessage === 'string' && (
                <div className="text-blue-700">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default SelectInput;
