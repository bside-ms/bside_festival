import { useMemo } from 'react';
import { uniqueId } from 'lodash';
import type { ReactElement } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import isEmptyNumber from 'lib/common/helper/isEmptyNumber';
import useIsMounted from 'lib/common/hooks/useIsMounted';

interface Props<T extends FieldValues> {
    name: FieldPath<T>;
    label: string;
    required?: boolean;
    maxLength?: number;
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
const TextArea = <T extends FieldValues,>({ label, name, required = false, maxLength }: Props<T>): ReactElement => {

    const { formState: { errors }, register } = useFormContext();

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

            <textarea
                id={id}
                className="border border-gray-700 p-1 rounded outline-0 w-full"
                rows={5}
                required={required}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register(
                    name,
                    {
                        required: {
                            value: required,
                            message: 'Dies ist ein Pflichtfeld',
                        },
                        maxLength: isEmptyNumber(maxLength) ? undefined : {
                            value: maxLength,
                            message: `Max. ${maxLength} Zeichen`,
                        },
                    }
                )}
            />

            {typeof errorMessage === 'string' && (
                <div className="text-blue-700">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default TextArea;
