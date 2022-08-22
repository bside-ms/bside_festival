import type Volunteer from 'lib/volunteers/Volunteer';
import type VolunteerTableData from 'lib/volunteers/VolunteerTableData';

const useVolunteersTableData = (volunteers: Array<Volunteer>): Array<VolunteerTableData> => {

    const getPreferenceData = (volunteer: Volunteer, preferenceKey: string): string => {
        const preferences = volunteer.confirmedQuestions.split(';');

        return preferences.includes(preferenceKey) ? '✅' : '❌';
    };

    return volunteers.map<VolunteerTableData>(volunteer => {

        return {
            ...volunteer,

            muscles: getPreferenceData(volunteer, 'muscles'),
            car: getPreferenceData(volunteer, 'car'),
            social: getPreferenceData(volunteer, 'social'),
            technician: getPreferenceData(volunteer, 'technician'),
            cook: getPreferenceData(volunteer, 'cook'),
            artist: getPreferenceData(volunteer, 'artist'),
            multi: getPreferenceData(volunteer, 'multi'),
            kids: getPreferenceData(volunteer, 'kids'),
            cleanup: getPreferenceData(volunteer, 'cleanup'),

            isFridayChecked: getPreferenceData(volunteer, 'friday'),
            isSaturdayChecked: getPreferenceData(volunteer, 'saturday'),
            isSundayChecked: getPreferenceData(volunteer, 'sunday'),
        };
    });

};

export default useVolunteersTableData;
