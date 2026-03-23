import { Type } from '@prisma/client';
import TextInput from '@/components/form/TextInput';
import SelectInput from '@/components/form/SelectInput';

import { ApplicationFormValues } from '@/components/applications/applicationForm/ApplicationForm';

interface Props {
    chosenType: Type;
}

const ApplicationDurationSelect = ({ chosenType }: Props) => {
    // 1. Concert Logic: Strict options
    if (chosenType === Type.Concert) {
        const options = ["15", "30", "45", "60", "75", "90"];
        
        return (
        <SelectInput<ApplicationFormValues>
                info="Bevorzugte Spielzeit"
                label="Bevorzugte Spielzeit (Minuten) *"
                name="durationPreference"
                options={options.map((status) => ({
                    value: status,
                    label: status,
                }))}
        />)
    }

    // 2. All other types (DJ, Performance, etc.): Flexible Text
    return (
        <TextInput
            name="durationPreference"
            label="Gewünschte Dauer"
            placeholder="z.B. 90 oder 120 Minuten..."
            info="Hier kannst du uns sagen, wie viel Zeit du idealerweise einplanst."
            required={true}
        />
    );
};

export default ApplicationDurationSelect;