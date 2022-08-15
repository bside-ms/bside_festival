import type VolunteerPreference from 'lib/volunteers/VolunteerPreference';

const volunteerPreferences = new Array<VolunteerPreference>(
    { key: 'muscles', label: 'Ich schleppe gerne' },
    { key: 'car', label: 'Ich habe ein Auto' },
    { key: 'social', label: 'Ich gehe gerne auf Menschen zu' },
    { key: 'technician', label: 'Ich möchte die Technik unterstützen' },
    { key: 'cook', label: 'Ich koche gerne' },
    { key: 'artist', label: 'Ich unterstütze gerne Künstler:innen' },
    { key: 'multi', label: 'Ich bin ein Multitalent' },
    { key: 'kids', label: 'Ich mache gerne etwas mit Kindern' },
    { key: 'cleanup', label: 'Ich räume gerne nach dem Festival auf' },
);

export default volunteerPreferences;
