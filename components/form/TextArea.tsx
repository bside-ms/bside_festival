import { useMemo } from 'react';
import { uniqueId } from 'lodash';
import type { ReactElement } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import isEmptyNumber from 'lib/common/helper/isEmptyNumber';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import useIsMounted from 'lib/common/hooks/useIsMounted';

interface Props<T extends FieldValues> {
    name: FieldPath<T>;
    label: string;
    info?: string;
    required?: boolean;
    maxLength?: number;
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
const TextArea = <T extends FieldValues,>({ label, name, info, required = false, maxLength }: Props<T>): ReactElement => {

    const { formState: { errors, isSubmitting }, register } = useFormContext();

    const isMounted = useIsMounted();
    const id = useMemo(
        () => isMounted ? uniqueId(name) : undefined,
        [isMounted, name]
    );

    const errorMessage = errors[name]?.message;

    return (
        <div className="flex flex-col">
            <textarea
                id={id}
                className={`p-2 rounded outline-0 ${typeof errorMessage === 'string' ? 'bg-rose-600 text-gray-100 placeholder:text-gray-100' : ''}`}
                rows={5}
                placeholder={required ? `${label} *` : label}
                required={required}
                disabled={isSubmitting}
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

export default TextArea;
