import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiPlus, HiTrash } from 'react-icons/hi';
import TextInput from '@/components/form/TextInput';

interface ApplicationLinkListProps {
    name: "publicLinks" | "privateLinks"; // Must match your interface keys
    title: string;
    description?: string;
    maxItems?: number;
}

const ApplicationLinkList = ({ name, title, description, maxItems = 10 }: ApplicationLinkListProps) => {
    const { control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: name,
    });
    const arrayError = errors[name] as any;
    const rootErrorMessage = arrayError?.message || arrayError?.root?.message;

    return (
        <section className="flex flex-col gap-4">
            <div>
                <h3 className="text-lg font-bold">{title}</h3>
                {description && <p className="text-sm text-gray-500">{description}</p>}

                {rootErrorMessage && (
                    <p className="mt-2 text-sm font-bold text-red-600">
                        {rootErrorMessage}
                    </p>
                )}
            </div>


            <div className="flex flex-col gap-3">
                {fields.map((field, index) => {
                    const individualError = arrayError?.[index]?.url;

                    return(
                        <div key={field.id} className="flex items-end gap-2">
                            <div className="flex-1">
                                <TextInput
                                    name={`${name}.${index}.url`}
                                    label={`Link #${index + 1}`}
                                    placeholder="https://..."
                                />
                                {individualError && (
                                    <span className="text-xs text-red-600 font-medium">
                                        {individualError.message}
                                    </span>
                                )}

                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="mb-1 p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                aria-label="Remove link"
                            >
                                <HiTrash className="h-5 w-5" />
                            </button>
                        </div>
                    )
                })}
            </div>

            {fields.length < maxItems && (
                <button
                    type="button"
                    onClick={() => append({ url: "" })}
                    className="mt-2 flex w-fit items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                >
                    <HiPlus /> Weiteren Link hinzufügen
                </button>
            )}
        </section>
    );
};

export default ApplicationLinkList;