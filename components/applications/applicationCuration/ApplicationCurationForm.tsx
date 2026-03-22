import SelectInput from '@/components/form/SelectInput';
import { setCuration } from '@/lib/actions/applicationActions';
import statusLabels from '@/lib/participants/status/statusLabels';
import statusOrder from '@/lib/participants/status/statusOrder';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ApplicationStatus } from '@prisma/client';
import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface CurationFormValues {
    applicationStatus: ApplicationStatus;
}

interface Props {
    application: SerializableParticipant;
}

const ApplicationCurationForm = ({ application }: Props): ReactElement => {
    const methods = useForm<CurationFormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
    } = methods;

    const handleFormSubmit = useCallback(
        async ({ applicationStatus }: CurationFormValues) => {
            clearErrors('root');

            try {
                await setCuration(application.id, applicationStatus);
            } catch {
                setError('root', { message: 'Fehler beim Submit!' });
            }
        },
        [application.id, clearErrors, setError],
    );

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-3xl flex-col gap-4">
                <div>
                    <div className="max-w-[250px]">
                        <SelectInput<CurationFormValues>
                            info="Status"
                            label="Status"
                            name="applicationStatus"
                            defaultValue={application.status}
                            options={statusOrder.map((status) => ({
                                value: status,
                                label: statusLabels[status],
                            }))}
                        />
                    </div>

                    <div className="mt-1 text-xs">
                        Sobald der Status "{statusLabels.Confirmed}" gesetzt ist, wird der Programmpunkt im Programm aufgelistet! Auch mit
                        Status "{statusLabels.Canceled}" erscheint der Punkt mit entsprechendem Hinweis in der Programmliste.
                    </div>
                </div>

                <label className="block max-w-[300px] bg-black p-1">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded border border-white bg-black p-3 font-display text-sm leading-3 text-white disabled:bg-gray-600"
                    >
                        Speichern
                    </button>
                </label>

                {isSubmitting && (
                    <div>
                        <span className="mr-1">Wird gespeichert</span>{' '}
                        <span className="inline-block w-3 animate-spin">
                            <FontAwesomeIcon icon={faSpinner} />
                        </span>
                    </div>
                )}

                {errors.root && <div className="text-red-600">{errors.root.message}</div>}
            </form>
        </FormProvider>
    );
};

export default ApplicationCurationForm;
