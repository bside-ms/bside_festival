import type { VolunteerFormValues } from 'components/volunteers/volunteerForm/VolunteerForm';

export type VolunteerPreferenceKey = keyof Pick<
    VolunteerFormValues,
    'canCook' | 'isSocial' | 'canSupportTechnician' | 'canSupportArtist' | 'hasCar' | 'canCarryHeavyStuff' | 'hasMultipleTalents'
>;

export type VolunteerDayPreferenceKey = keyof Pick<
    VolunteerFormValues,
    'isAvailableOnFriday' | 'isAvailableOnSaturday' | 'isAvailableOnSunday'
>;

export default interface VolunteerPreference {
    key: VolunteerPreferenceKey | VolunteerDayPreferenceKey;
    label: string;
    emoji?: string;
}
