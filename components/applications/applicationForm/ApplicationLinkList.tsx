import React, { memo, useCallback } from 'react';
import { useFieldArray, useFormContext, get } from 'react-hook-form';
import { HiPlus, HiTrash } from 'react-icons/hi';
import TextInput from '@/components/form/TextInput';

interface LinkItemProps {
    index: number;
    name: string;
    onRemove: (index: number) => void;
    error?: { message?: string };
}

const LinkItem = memo(({ index, name, onRemove, error }: LinkItemProps) => {
    // This handler is now defined inside the component scope
    const handleRemove = useCallback(() => {
        onRemove(index);
    }, [index, onRemove]);

    return (
        <div className="flex items-end gap-2 animate-in fade-in slide-in-from-left-1">
            <div className="flex-1">
                <TextInput
                    name={`${name}.${index}.url`}
                    label={`Link #${index + 1}`}
                    placeholder="https://..."
                />
                {error && (
                    <span className="text-xs font-medium text-red-600">
                        {error.message}
                    </span>
                )}
            </div>
            <button
                type="button"
                onClick={handleRemove} // Stable reference, linter is happy!
                className="mb-1 p-2 text-red-500 transition-colors hover:bg-red-50 rounded"
                aria-label="Remove link"
            >
                <HiTrash className="h-5 w-5" />
            </button>
        </div>
    );
});

LinkItem.displayName = 'LinkItem';

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
    const arrayError = get(errors, name);
    const rootErrorMessage = arrayError?.message || arrayError?.root?.message;

    // Stable handler for the Add button
    const handleAppend = useCallback(() => {
        append({ url: "" });
    }, [append]);

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
                {fields.map((field, index) => (
                    <LinkItem
                        key={field.id}
                        index={index}
                        name={name}
                        onRemove={remove}
                        error={arrayError?.[index]?.url}
                    />
                ))}
            </div>

            {fields.length < maxItems && (
                <button
                    type="button"
                    onClick={handleAppend}
                    className="mt-2 flex w-fit items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                >
                    <HiPlus /> Weiteren Link hinzufügen
                </button>
            )}
        </section>
    );
};

export default ApplicationLinkList;