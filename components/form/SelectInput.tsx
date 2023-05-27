import { useMemo } from 'react';
import { uniqueId } from 'lodash';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form/dist/types/fields';
import type { FieldPath } from 'react-hook-form/dist/types/path/eager';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import useIsMounted from 'lib/common/hooks/useIsMounted';

interface Props<T extends FieldValues> {
    name: FieldPath<T>;
    label: string;
    info?: string;
    options: Array<{ value: string, label: string }>;
    required?: boolean;
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
const SelectInput = <T extends FieldValues,>({ label, name, info, options, required = false, }: Props<T>): ReactElement => {

    const { formState: { errors }, register } = useFormContext();

    const isMounted = useIsMounted();
    const id = useMemo(
        () => isMounted ? uniqueId(name) : undefined,
        [isMounted, name]
    );

    const errorMessage = errors[name]?.message;

    return (
        <div className="flex flex-col">
            <select
                id={id}
                className="p-1 rounded bg-white py-2 outline-0"
                required={required}
                defaultValue=""
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
                <option disabled={true} value="">{required ? `${label} *` : label}</option>
                {options.map(({ label: optionLabel, value }) => (
                    <option key={value} value={value}>
                        {optionLabel}
                    </option>
                ))}
            </select>
            {isNotEmptyString(info) && (
                <label htmlFor={id} className="px-1">
                    {info}
                </label>
            )}

            {typeof errorMessage === 'string' && (
                <div className="px-1 text-pink-300">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default SelectInput;
