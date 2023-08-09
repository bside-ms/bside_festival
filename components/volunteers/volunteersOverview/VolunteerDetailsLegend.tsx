import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import { dayPreferences, preferences } from 'components/volunteers/volunteersOverview/VolunteerDetails';
import volunteerDayPreferences from 'lib/volunteers/volunteerDayPreferences';
import volunteerPreferences from 'lib/volunteers/volunteerPreferences';

const VolunteerDetailsLegend = (): ReactElement => {

    return (
        <div className="rounded-md drop-shadow bg-gray-50 py-4 px-4">
            <div className="space-y-1">
                {preferences.map(([preference, iconName]) => (
                    <div key={preference} className="flex gap-2">
                        <FontAwesomeIcon
                            className="w-6 h-6"
                            icon={iconName}

                        />
                        {volunteerPreferences.find(({ key }) => key === preference)?.label}
                    </div>
                ))}
            </div>
            <div className="mt-4">
                {dayPreferences.map(([preference, label]) => (
                    <div key={preference} className="flex gap-2 items-center">
                        <div
                            className="text-xl w-6"
                        >
                            {label}
                        </div>
                        {volunteerDayPreferences.find(({ key }) => key === preference)?.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VolunteerDetailsLegend;
