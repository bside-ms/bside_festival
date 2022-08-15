import type VolunteerPreference from 'lib/volunteers/VolunteerPreference';

const volunteerDayPreferences = new Array<VolunteerPreference>(
    { key: 'friday', label: 'Freitag' },
    { key: 'saturday', label: 'Samstag' },
    { key: 'sunday', label: 'Sonntag' },
);

export default volunteerDayPreferences;
