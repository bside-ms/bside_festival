import { useCallback } from 'react';
import type { ReactElement } from 'react';
import VolunteerFormCheckboxField from 'components/volunteers/VolunteerFormCheckboxField';
import { useVolunteerFormContext } from 'components/volunteers/VolunteerFormContext';
import VolunteerFormTextAreaField from 'components/volunteers/VolunteerFormTextAreaField';
import volunteerPreferences from 'lib/volunteers/volunteerPreferences';

const VolunteerFormPreferencesFields = (): ReactElement => {

    const { formValues, setFormValue } = useVolunteerFormContext();

    const getNewConfirmedQuestions = useCallback((fieldName: string, isChecked: boolean): Array<string> => {

        const confirmedQuestions = formValues.confirmedQuestions.split(';');

        if (isChecked) {
            return [...confirmedQuestions, fieldName];
        }

        return confirmedQuestions.filter(preference => preference !== fieldName);
    }, [formValues.confirmedQuestions]);

    const handleToggle = useCallback((fieldName: string, isChecked: boolean) => {

        const newConfirmedQuestions = getNewConfirmedQuestions(fieldName, isChecked);

        setFormValue(
            'confirmedQuestions',
            newConfirmedQuestions.filter(question => !!question).join(';')
        );

    }, [getNewConfirmedQuestions, setFormValue]);

    return (
        <div className="mb-5">
            <div className="mt-2 mb-3">
                {volunteerPreferences.map(({ key, label }) => (
                    <VolunteerFormCheckboxField
                        fieldName={key}
                        key={key}
                        onToggle={handleToggle}
                    >
                        {label}
                    </VolunteerFormCheckboxField>
                ))}
            </div>

            <VolunteerFormTextAreaField
                fieldName="additionalInformation"
                label="Was sollten wir noch wissen?"
                isOptional={true}
            />
        </div>
    );
};

export default VolunteerFormPreferencesFields;
