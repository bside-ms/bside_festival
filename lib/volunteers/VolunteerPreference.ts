import type { VolunteerFormValues } from 'components/volunteers/volunteerForm/VolunteerForm';

export default interface VolunteerPreference {
    key: keyof VolunteerFormValues;
    label: string;
    emoji?: string;
}
