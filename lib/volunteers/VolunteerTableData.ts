import type Volunteer from 'lib/volunteers/Volunteer';

export default interface VolunteerTableData extends Volunteer {
    // Preferences
    muscles: string;
    car: string;
    social: string;
    technician: string;
    cook: string;
    artist: string;
    multi: string;
    kids: string;
    cleanup: string;

    // Day preferences
    isFridayChecked: string;
    isSaturdayChecked: string;
    isSundayChecked: string;
}
