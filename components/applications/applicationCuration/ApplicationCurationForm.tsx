import { useCallback } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ApplicationStatus, Label } from '@prisma/client';
import { range } from 'lodash';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ApplicationCurationLabelSelect from 'components/applications/applicationCuration/ApplicationCurationLabelSelect';
import { useApplicationsOverviewContext } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import SelectInput from 'components/form/SelectInput';
import TextArea from 'components/form/TextArea';
import isEmptyString from 'lib/common/helper/isEmptyString';
import statusLabels from 'lib/participants/status/statusLabels';
import statusOrder from 'lib/participants/status/statusOrder';
import type { SetCurationRequest, SuccessfulSetCurationResponse } from 'pages/api/applications/curation/set';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

export interface CurationFormValues {
    curationScore: string;
    curationInfo: string | null;
    applicationStatus: ApplicationStatus;
    labels: Array<string | number>;
}

interface Props {
    application: SerializableParticipant;
    labels: Array<Label>;
}

const ApplicationCurationForm = ({ application, labels }: Props): ReactElement => {

    const { updateApplication, updateAllLabels, updateParticipantLabels } = useApplicationsOverviewContext();

    const methods = useForm<CurationFormValues>();
    const { handleSubmit, setError, formState: { errors, isSubmitting }, clearErrors } = methods;

    const handleFormSubmit = useCallback(async ({ curationInfo, curationScore, applicationStatus, labels: updatedLabels }: CurationFormValues) => {

        clearErrors('root');

        const request: SetCurationRequest = {
            id: application.id,
            curationScore: isEmptyString(curationScore) ? null : Number(curationScore),
            curationInfo: isEmptyString(curationInfo) ? null : curationInfo,
            applicationStatus,
            labels: updatedLabels,
        };

        const response = await fetch('/api/applications/curation/set', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            setError('root', { message: 'Fehler beim Submit!' });
        } else {

            const { updatedParticipant, allLabels, participantLabels } = await response.json() as SuccessfulSetCurationResponse;

            updateApplication(updatedParticipant);
            updateAllLabels(allLabels);
            updateParticipantLabels(participantLabels);
        }

    }, [application.id, clearErrors, setError, updateAllLabels, updateApplication, updateParticipantLabels]);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                noValidate={true}
                className="flex gap-4 flex-col max-w-3xl"
            >
                <div className="font-display">
                    Kuration
                </div>

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

                <ApplicationCurationLabelSelect
                    labels={labels}
                />

                <TextArea<CurationFormValues>
                    name="curationInfo"
                    label="Kommentar zur Bewertung"
                    defaultValue={application.curationInfo ?? undefined}
                />

                <div className="font-display">
                    Status
                </div>

                <div>
                    <div className="max-w-[250px]">
                        <SelectInput<CurationFormValues>
                            label="Status"
                            name="applicationStatus"
                            defaultValue={application.status}
                            options={
                                statusOrder.map(status => ({
                                    value: status,
                                    label: statusLabels[status],
                                }))
                            }
                        />
                    </div>

                    <div className="text-xs mt-1">
                        Sobald der Status "{statusLabels.Confirmed}" gesetzt ist, wird
                        der Programmpunkt (später) unter Programm aufgelistet!
                    </div>
                </div>

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
        </FormProvider>
    );
};

export default ApplicationCurationForm;
