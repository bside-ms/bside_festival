import type VolunteerPreference from 'lib/volunteers/VolunteerPreference';

const volunteerPreferences = new Array<VolunteerPreference>(
    { key: 'muscles', label: 'Ich schleppe gerne', emoji: '💪' },
    { key: 'car', label: 'Ich habe ein Auto', emoji: '🚗' },
    { key: 'social', label: 'Ich gehe gerne auf Menschen zu', emoji: '👥' },
    { key: 'technician', label: 'Ich möchte die Technik unterstützen', emoji: '🧑‍🔧' },
    { key: 'cook', label: 'Ich koche gerne', emoji: '🧑‍🍳' },
    { key: 'artist', label: 'Ich unterstütze gerne Künstler:innen', emoji: '🧑‍🎨' },
    { key: 'kids', label: 'Ich mache gerne etwas mit Kindern', emoji: '🧒' },
    { key: 'cleanup', label: 'Ich räume gerne nach dem Festival auf', emoji: '🧹' },
    { key: 'multi', label: 'Ich bin ein Multitalent', emoji: '🌟' },
);

export default volunteerPreferences;
