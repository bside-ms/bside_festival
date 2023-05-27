import type { ReactElement } from 'react';
import type { FieldPath } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form/dist/types/fields';

interface Props<T extends FieldValues> {
    name: FieldPath<T>;
}

const HiddenInput = <T extends FieldValues>({ name }: Props<T>): ReactElement => {

    const { register } = useFormContext();

    return (
        <input
            type="hidden"
            {...register(name)}
        />
    );
};

export default HiddenInput;
