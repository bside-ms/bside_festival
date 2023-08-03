import type VolunteerPreference from './VolunteerPreference';

const volunteerPreferences = new Array<VolunteerPreference>(
    { key: 'canCook', label: 'Ich koche gerne', emoji: '🧑‍🍳' },
    { key: 'isSocial', label: 'Ich gehe gerne auf Menschen zu', emoji: '👥' },
    { key: 'canSupportTechnician', label: 'Ich möchte die Technik unterstützen', emoji: '🧑‍🔧' },
    { key: 'canSupportArtist', label: 'Ich unterstütze gerne Künstler:innen', emoji: '🧑‍🎨' },
    // { key: 'canWorkWithChildren', label: 'Ich mache gerne etwas mit Kindern', emoji: '🧒' },
    { key: 'hasCar', label: 'Ich habe ein Auto', emoji: '🚗' },
    { key: 'canCarryHeavyStuff', label: 'Ich schleppe gerne', emoji: '💪' },
    { key: 'hasMultipleTalents', label: 'Ich bin ein Multitalent', emoji: '🌟' },
);

export default volunteerPreferences;
