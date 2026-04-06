import Checkbox from '@/components/form/Checkbox';
import TextInput from '@/components/form/TextInput';
import { memo, useEffect } from 'react';
import { get, useFieldArray, useFormContext } from 'react-hook-form';

interface ZipcodeItemProps {
    index: number;
    error?: { message?: string };
}

const ZipcodeItem = memo(({ index, error }: ZipcodeItemProps) => {
    const { watch } = useFormContext();
    const isInternational = watch(`participantZipcodes.${index}.isInternational`);

    return (
        <div className="flex flex-col">
            <div className="flex gap-2 rounded-md p-1">
                <span className="p-2">{index + 1}.</span>
                <TextInput
                    name={`participantZipcodes.${index}.code`}
                    label={`Mitglied #${index + 1} ${isInternational ? '(Land)' : '(PLZ)'}`}
                    placeholder={isInternational ? 'z.B. Niederlande' : '48143'}
                />
                <div className="flex items-center gap-2">
                    <Checkbox name={`participantZipcodes.${index}.isInternational`} label="außerhalb Deutschlands" />
                </div>
            </div>
            {error && <span className="ps-10 text-xs font-medium text-red-600">{error.message}</span>}
        </div>
    );
});
ZipcodeItem.displayName = 'ZipcodeItem';

const ApplicationZipcodes = () => {
    const {
        control,
        watch,
        formState: { errors },
    } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'participantZipcodes',
    });
    const arrayError = get(errors, 'participantZipcodes');

    // Watch the total member count from the other component
    const totalCount = watch('participantCount');

    // Auto-sync the number of zipcode inputs with the member count
    useEffect(() => {
        const currentLength = fields.length;
        if (totalCount > currentLength) {
            for (let i = 0; i < totalCount - currentLength; i++) {
                append({ code: '', isInternational: false }, { shouldFocus: false });
            }
        } else if (totalCount < currentLength) {
            for (let i = 0; i < currentLength - totalCount; i++) {
                remove(currentLength - 1 - i);
            }
        }
    }, [totalCount, fields.length, append, remove]);

    return (
        <div className="mt-4 flex flex-col gap-2">
            <p>Wohnorte der einzelnen Mitglieder (PLZ oder Land)</p>
            <div className="grid grid-cols-1 gap-1">
                {fields.map((field, index) => (
                    <ZipcodeItem key={field.id} index={index} error={arrayError?.[index]?.code} />
                ))}
            </div>
        </div>
    );
};

export default ApplicationZipcodes;
