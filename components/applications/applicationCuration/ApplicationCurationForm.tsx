import { useCallback } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { range } from 'lodash';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import SelectInput from 'components/form/SelectInput';
import TextArea from 'components/form/TextArea';
import isEmptyString from 'lib/common/helper/isEmptyString';
import type { SetCurationRequest, SuccessfulSetCurationResponse } from 'pages/api/applications/curation/set';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

export interface CurationFormValues {
    curationScore: string;
    curationInfo: string | null;
}

interface Props {
    application: SerializableParticipant;
}

const ApplicationCurationForm = ({ application }: Props): ReactElement => {

    const { updateApplication } = useApplicationsOverviewContext();

    const methods = useForm<CurationFormValues>();
    const { handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors } = methods;

    const handleFormSubmit = useCallback(async ({ curationInfo, curationScore }: CurationFormValues) => {

        clearErrors('root');

        const request: SetCurationRequest = {
            id: application.id,
            curationScore: isEmptyString(curationScore) ? null : Number(curationScore),
            curationInfo: isEmptyString(curationInfo) ? null : curationInfo,
        };

        const response = await fetch('/api/applications/curation/set', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            setError('root', { message: 'Fehler beim Submit!' });
        } else {

            const { updatedParticipant } = await response.json() as SuccessfulSetCurationResponse;

            updateApplication(updatedParticipant);
        }

    }, [application.id, clearErrors, setError, updateApplication]);

    return (
        <FormProvider {...methods}>
            <div className="my-4">
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    noValidate={true}
                    className="flex gap-4 flex-col max-w-3xl"
                >
                    <div className="max-w-[250px]">
                        <SelectInput<CurationFormValues>
                            label="Bewertung"
                            name="curationScore"
                            defaultValue={application.curationScore?.toString()}
                            options={[
                                { value: '', label: 'Unbewertet' },
                                ...range(0, 11).map(scoreValue => ({
                                    value: scoreValue.toString(),
                                    label: scoreValue.toString(),
                                })),
                            ]}
                        />
                    </div>

                    <TextArea<CurationFormValues>
                        name="curationInfo"
                        label="Kommentar zur Bewertung"
                        defaultValue={application.curationInfo ?? undefined}
                    />

                    <label className="max-w-[300px] bg-black p-1 block">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white border border-white rounded font-display text-sm leading-3 p-3 disabled:bg-gray-600"
                        >
                            Speichern
                        </button>
                    </label>

                    {isSubmitting && (
                        <div className="text-black">
                            <span className="mr-1">Wird gespeichert</span> <span className="animate-spin inline-block w-3"><FontAwesomeIcon icon={faSpinner} /></span>
                        </div>
                    )}

                    {errors.root && (
                        <div className="text-red-600">
                            {errors.root.message}
                        </div>
                    )}
                </form>
            </div>
        </FormProvider>
    );
};

export default ApplicationCurationForm;
