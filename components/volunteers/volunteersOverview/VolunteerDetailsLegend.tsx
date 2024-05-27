import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import { dayPreferences, preferences } from 'components/volunteers/volunteersOverview/VolunteerDetails';
import volunteerDayPreferences from 'lib/volunteers/volunteerDayPreferences';
import volunteerPreferences from 'lib/volunteers/volunteerPreferences';

const VolunteerDetailsLegend = (): ReactElement => {
    return (
        <div className="rounded-md bg-gray-50 p-4 drop-shadow">
            <div className="space-y-1">
                {preferences.map(([preference, iconName]) => (
                    <div key={preference} className="flex gap-2">
                        <FontAwesomeIcon className="size-6" icon={iconName} />
                        {volunteerPreferences.find(({ key }) => key === preference)?.label}
                    </div>
                ))}
            </div>
            <div className="mt-4">
                {dayPreferences.map(([preference, label]) => (
                    <div key={preference} className="flex items-center gap-2">
                        <div className="w-6 text-xl">{label}</div>
                        {volunteerDayPreferences.find(({ key }) => key === preference)?.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VolunteerDetailsLegend;
