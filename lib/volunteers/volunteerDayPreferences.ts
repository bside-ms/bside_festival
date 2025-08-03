import type VolunteerPreference from './VolunteerPreference';

const volunteerDayPreferences = new Array<VolunteerPreference>(
    { key: 'isAvailableBefore', label: 'Bereits vor dem Festival (Deko, etc.)', emoji: '📆' },
    { key: 'isAvailableOnFriday', label: 'Freitag, 19.09.', emoji: '📆' },
    { key: 'isAvailableOnSaturday', label: 'Samstag, 20.09.', emoji: '📆' },
);

export default volunteerDayPreferences;
