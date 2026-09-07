import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import TextArea from '@/components/form/TextArea';
import { updateApplicationTechnicalRider } from '@/lib/actions/applicationActions';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import { applicationTechnicalRiderMaxLength, updateApplicationTechnicalRiderSchema } from '@/lib/schemas/applicationSchema';
import allowedTechnicRiderContentType from '@/lib/upload/allowedTechnicRiderContentType';
import createPublicObjectUrl from '@/lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import { default as NextLink } from 'next/link';
import { useCallback, useState, type ChangeEvent, type ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FaFilePdf } from 'react-icons/fa6';
import type { z } from 'zod';

interface Props {
    application: SerializableParticipant;
}

type FormValues = z.infer<typeof updateApplicationTechnicalRiderSchema>;

const ApplicationDetailsTechnicalRider = ({ application: { id, technicalRider, technicalRiderFileName } }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const [fileName, setFileName] = useState(technicalRiderFileName);
    const toggleShowForm = useCallback(() => setShowForm((value) => !value), []);
    const methods = useForm<FormValues>({
        defaultValues: { removeTechnicalRiderPdf: false },
        resolver: zodResolver(updateApplicationTechnicalRiderSchema),
    });
    const {
        formState: { errors, isSubmitting },
        handleSubmit,
        register,
        setError,
        setValue,
    } = methods;
    const onFileChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file === undefined) {
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setValue('encodedTechnicalRiderPdf', typeof reader.result === 'string' ? reader.result : '');
                setFileName(file.name);
            };
            reader.readAsDataURL(file);
        },
        [setValue],
    );
    const onSubmit = useCallback(
        async (values: FormValues) => {
            try {
                await updateApplicationTechnicalRider(id, values);
                toggleShowForm();
            } catch {
                setError('root', { message: 'Fehler beim Submit!' });
            }
        },
        [id, setError, toggleShowForm],
    );
    const onRemoveFile = useCallback(() => {
        setValue('removeTechnicalRiderPdf', true);
        setFileName(null);
    }, [setValue]);

    const technicalRiderPdfUrl = isEmptyString(technicalRiderFileName) ? null : createPublicObjectUrl(technicalRiderFileName);

    if (showForm) {
        return (
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <TextArea<FormValues>
                        name="technicalRider"
                        label="Technical Rider"
                        maxLength={applicationTechnicalRiderMaxLength}
                        defaultValue={technicalRider ?? ''}
                    />
                    <input {...register('removeTechnicalRiderPdf')} type="hidden" />
                    <input type="file" accept={allowedTechnicRiderContentType} onChange={onFileChange} />
                    {fileName !== null && (
                        <div className="flex items-center gap-2 text-sm">
                            {fileName}
                            <button type="button" className="text-red-600" onClick={onRemoveFile}>
                                PDF entfernen
                            </button>
                        </div>
                    )}
                    <ApplicationDetailsFormControls
                        errorMessage={errors.root?.message}
                        isSubmitting={isSubmitting}
                        onCancel={toggleShowForm}
                    />
                </form>
            </FormProvider>
        );
    }

    return (
        <div>
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Technical Rider</ApplicationDetailsTitle>

            {isEmptyString(technicalRider) && isEmptyString(technicalRiderFileName) && <span className="text-gray-500">keine Angabe</span>}
            {isNotEmptyString(technicalRider) && <div className="whitespace-pre-wrap">{technicalRider}</div>}

            {isNotEmptyString(technicalRiderPdfUrl) && (
                <NextLink
                    href={technicalRiderPdfUrl}
                    target="_blank"
                    className="inline-flex cursor-pointer items-center rounded bg-gray-400/40 p-1 text-xl text-sky-500 hover:bg-gray-400/50"
                >
                    <FaFilePdf />
                </NextLink>
            )}
        </div>
    );
};

export default ApplicationDetailsTechnicalRider;
