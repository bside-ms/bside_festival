import type VolunteerPreference from './VolunteerPreference';

const volunteerDayPreferences = new Array<VolunteerPreference>(
    { key: 'isAvailableOnFriday', label: 'Ich habe am Freitag Zeit', emoji: '📆' },
    { key: 'isAvailableOnSaturday', label: 'Ich habe am Samstag Zeit', emoji: '📆' },
    { key: 'isAvailableOnSunday', label: 'Ich habe am Sonntag Zeit', emoji: '📆' },
);

export default volunteerDayPreferences;
