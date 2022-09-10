import type { ReactElement } from 'react';
import VolunteerFormTextField from 'components/volunteers/VolunteerFormTextField';

const VolunteerContactFields = (): ReactElement => {

    return (
        <div className="space-y-5 md:max-w-[550px]">
            <VolunteerFormTextField
                fieldName="fullName"
                label="Vor- und Nachname"
            />

            <VolunteerFormTextField
                fieldName="phoneNumber"
                label="Telefonnummer"
            />

            <VolunteerFormTextField
                fieldName="preferredMessengers"
                label="Bevorzugte Messenger"
                helperText="WhatsApp, Signal, Telegram, etc."
                isOptional={true}
            />
        </div>
    );
};

export default VolunteerContactFields;
