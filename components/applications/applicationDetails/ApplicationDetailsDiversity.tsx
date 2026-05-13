import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import Checkbox from '@/components/form/Checkbox';
import TextArea from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { updateApplicationDiversityInfo } from '@/lib/actions/applicationActions';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import { applicationDiversityNotesMaxLength, createUpdateApplicationDiversityInfoSchema } from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type DiversityInfoFormValues = z.infer<ReturnType<typeof createUpdateApplicationDiversityInfoSchema>>;

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsDiversity = ({
    application: { diversityNotes, flintaParticipantsCount, hasMarginalizedParticipants, id, participantCount },
}: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const schema = createUpdateApplicationDiversityInfoSchema(participantCount);
    const methods = useForm<DiversityInfoFormValues>({ resolver: zodResolver(schema) });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: DiversityInfoFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationDiversityInfo(id, values);
                toggleShowForm();
            } catch {
                setError('root', { message: 'Fehler beim Submit!' });
            }
        },
        [clearErrors, id, setError, toggleShowForm],
    );

    if (showForm) {
        return (
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate={true} className="flex max-w-3xl flex-col gap-4">
                    <TextInput<DiversityInfoFormValues>
                        name="flintaParticipantsCount"
                        label="FLINTA* Personen"
                        info="FLINTA* Personen"
                        type="number"
                        required={true}
                        defaultValue={flintaParticipantsCount.toString()}
                    />

                    <div>
                        <div className="px-1 text-base">Personen anderer marginalisierter Gruppen</div>
                        <Checkbox<DiversityInfoFormValues>
                            name="hasMarginalizedParticipants"
                            label="Es sind Personen anderer marginalisierter Gruppen beteiligt?"
                            initiallyChecked={hasMarginalizedParticipants}
                        />
                    </div>

                    <TextArea<DiversityInfoFormValues>
                        name="diversityNotes"
                        label="Anmerkungen zu Barrierefreiheit oder Support-Wünschen"
                        info="Anmerkungen zu Barrierefreiheit oder Support-Wünschen"
                        maxLength={applicationDiversityNotesMaxLength}
                        defaultValue={diversityNotes ?? ''}
                    />

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
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Diversität</ApplicationDetailsTitle>
            <div>FLINTA* Personen: {flintaParticipantsCount}</div>
            <div>Personen anderer marginalisierter Gruppen: {hasMarginalizedParticipants ? 'ja' : 'nein'}</div>

            <div className="mt-1 whitespace-pre-wrap">
                {isNotEmptyString(diversityNotes) ? diversityNotes : <span className="text-gray-500">keine Angabe</span>}
            </div>
        </div>
    );
};

export default ApplicationDetailsDiversity;
