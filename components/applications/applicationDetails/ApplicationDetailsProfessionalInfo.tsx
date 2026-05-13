import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import Checkbox from '@/components/form/Checkbox';
import TextInput from '@/components/form/TextInput';
import { updateApplicationBookingInfo } from '@/lib/actions/applicationActions';
import { createUpdateApplicationBookingInfoSchema } from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type BookingInfoFormValues = z.infer<ReturnType<typeof createUpdateApplicationBookingInfoSchema>>;

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsProfessionalInfo = ({
    application: { id, isProfessionalBooking, participantCount, professionalParticipantsCount },
}: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const schema = createUpdateApplicationBookingInfoSchema(participantCount);
    const methods = useForm<BookingInfoFormValues>({ resolver: zodResolver(schema) });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
        watch,
    } = methods;
    const isProfessionalBookingChecked = watch('isProfessionalBooking', isProfessionalBooking);

    const handleFormSubmit = useCallback(
        async (values: BookingInfoFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationBookingInfo(id, values);
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
                    <div>
                        <div className="px-1 text-base">Agentur-Bewerbung</div>
                        <Checkbox<BookingInfoFormValues>
                            name="isProfessionalBooking"
                            label="Erfolgt diese Bewerbung durch eine Agentur in Vertretung für die Künstler*innen?"
                            initiallyChecked={isProfessionalBooking}
                        />
                    </div>

                    <TextInput<BookingInfoFormValues>
                        name="professionalParticipantsCount"
                        label="Anzahl der Profis"
                        info="Anzahl der Profis"
                        type="number"
                        defaultValue={professionalParticipantsCount.toString()}
                        isDisabled={isProfessionalBookingChecked}
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
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Booking</ApplicationDetailsTitle>
            <div>Agentur-Bewerbung: {isProfessionalBooking ? 'ja' : 'nein'}</div>
            <div>Professionelle Künstler*innen: {professionalParticipantsCount}</div>
        </div>
    );
};

export default ApplicationDetailsProfessionalInfo;
