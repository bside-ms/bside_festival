import type { Volunteer } from '@prisma/client';
import type { ReactElement } from 'react';
import type { VolunteerDayPreferenceKey } from 'lib/volunteers/VolunteerPreference';
import cn from 'lib/common/helper/cn';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';

interface Props {
    volunteer: Volunteer;
    showSensitiveData: boolean;
}

const dayPreferences = new Array<[VolunteerDayPreferenceKey, string]>(
    ['isAvailableOnFriday', 'Fr'],
    ['isAvailableOnSaturday', 'Sa'],
    ['isAvailableOnSunday', 'So'],
);

const VolunteerDetails = ({ volunteer, showSensitiveData }: Props): ReactElement => {
    return (
        <div className="rounded-md bg-gray-50 px-4 pb-3 pt-2 drop-shadow">
            <div className="mb-2 text-xl">{volunteer.fullName}</div>

            {showSensitiveData && (
                <div className="mb-3 text-base text-gray-600">
                    <div>
                        <a href={`tel:${volunteer.phoneNumber}`} className="md:cursor-pointer md:hover:text-gray-900">
                            {volunteer.phoneNumber}
                        </a>
                    </div>
                    <div>
                        <a href={`mailto:${volunteer.mailAddress}`} className="md:cursor-pointer md:hover:text-gray-900">
                            {volunteer.mailAddress}
                        </a>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2">
                {dayPreferences.map(([dayPreference, label]) => (
                    <div key={dayPreference} className={cn('text-xl leading-4', !volunteer[dayPreference] && 'text-gray-300')}>
                        {label}
                    </div>
                ))}
            </div>

            {isNotEmptyString(volunteer.additionalInfo) && (
                <pre className="mt-4 border-l-2 border-gray-400 pl-3 font-sans italic text-gray-600">{volunteer.additionalInfo}</pre>
            )}
        </div>
    );
};

export default VolunteerDetails;
