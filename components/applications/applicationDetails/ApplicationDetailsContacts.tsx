import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import TextInput from '@/components/form/TextInput';
import { updateApplicationContactInfo } from '@/lib/actions/applicationActions';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import { updateApplicationContactInfoSchema } from '@/lib/schemas/applicationSchema';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

type ContactInfoFormValues = z.infer<typeof updateApplicationContactInfoSchema>;

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsContacts = ({ application: { contactMail, contactName, contactPhone, id } }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((prevState) => !prevState), []);

    const methods = useForm<ContactInfoFormValues>({ resolver: zodResolver(updateApplicationContactInfoSchema) });
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;

    const handleFormSubmit = useCallback(
        async (values: ContactInfoFormValues) => {
            clearErrors('root');

            try {
                await updateApplicationContactInfo(id, values);
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
                    <TextInput<ContactInfoFormValues>
                        name="contactName"
                        label="Ansprechperson"
                        info="Ansprechperson"
                        required={true}
                        defaultValue={contactName ?? ''}
                    />

                    <TextInput<ContactInfoFormValues>
                        name="contactMail"
                        label="E-Mail-Adresse"
                        info="E-Mail-Adresse"
                        required={true}
                        defaultValue={contactMail}
                    />

                    <TextInput<ContactInfoFormValues>
                        name="contactPhone"
                        label="Telefonnummer"
                        info="Telefonnummer"
                        required={true}
                        defaultValue={contactPhone ?? ''}
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
            <ApplicationDetailsTitle onEditClick={toggleShowForm}>Kontakt</ApplicationDetailsTitle>

            {isNotEmptyString(contactName) && (
                <div className="flex items-center">
                    <div className="mr-2 w-4 shrink-0 text-center text-sm">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div>{contactName}</div>
                </div>
            )}
            {isNotEmptyString(contactMail) && (
                <div className="flex items-center">
                    <div className="mr-2 w-4 shrink-0 text-center text-sm">
                        <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div>{contactMail}</div>
                </div>
            )}
            {isNotEmptyString(contactPhone) && (
                <div className="flex items-center">
                    <div className="mr-2 w-4 shrink-0 text-center text-sm">
                        <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div>{contactPhone}</div>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetailsContacts;
