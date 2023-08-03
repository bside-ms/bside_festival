import type VolunteerPreference from './VolunteerPreference';

const volunteerDayPreferences = new Array<VolunteerPreference>(
    { key: 'isAvailableOnFriday', label: 'Ich habe Zeit am Freitag, den 15.09.', emoji: '📆' },
    { key: 'isAvailableOnSaturday', label: 'Ich habe Zeit am Samstag, den 16.09.', emoji: '📆' },
    { key: 'isAvailableOnSunday', label: 'Ich habe Zeit am Sonntag, den 17.09.', emoji: '📆' },
);

export default volunteerDayPreferences;
