import type VolunteerPreference from './VolunteerPreference';

const volunteerDayPreferences = new Array<VolunteerPreference>(
    { key: 'isAvailableOnFriday', label: 'Freitag, 20.09.', emoji: '📆' },
    { key: 'isAvailableOnSaturday', label: 'Samstag, 21.09.', emoji: '📆' },
    { key: 'isAvailableOnSunday', label: 'Sonntag, 22.09.', emoji: '📆' },
);

export default volunteerDayPreferences;
