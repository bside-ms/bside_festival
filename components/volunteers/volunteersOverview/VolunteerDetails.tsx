import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
    faCarSide,
    faDumbbell,
    faKitchenSet,
    faMicrophoneLines,
    faPeopleGroup,
    faScrewdriverWrench,
    faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Volunteer } from '@prisma/client';
import type { ReactElement } from 'react';
import type { VolunteerDayPreferenceKey, VolunteerPreferenceKey } from 'lib/volunteers/VolunteerPreference';

interface Props {
    volunteer: Volunteer;
    showSensitiveData: boolean;
}

export const preferences = new Array<[VolunteerPreferenceKey, IconProp]>(
    ['canCook', faKitchenSet],
    ['isSocial', faPeopleGroup],
    ['canSupportTechnician', faScrewdriverWrench],
    ['canSupportArtist', faMicrophoneLines],
    ['hasCar', faCarSide],
    ['canCarryHeavyStuff', faDumbbell],
    ['hasMultipleTalents', faStar],
);

export const dayPreferences = new Array<[VolunteerDayPreferenceKey, string]>(
    ['isAvailableOnFriday', 'Fr'],
    ['isAvailableOnSaturday', 'Sa'],
    ['isAvailableOnSunday', 'So'],
);

const VolunteerDetails = ({ volunteer, showSensitiveData }: Props): ReactElement => {
    return (
        <div className="rounded-md bg-gray-50 px-4 py-2 drop-shadow">
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
                {preferences.map(([preference, iconName]) => (
                    <FontAwesomeIcon
                        key={preference}
                        className="size-6"
                        style={{ color: volunteer[preference] ? undefined : '#CCC' }}
                        icon={iconName}
                    />
                ))}

                <div className="w-4" />

                {dayPreferences.map(([dayPreference, label]) => (
                    <div key={dayPreference} className="text-xl leading-4" style={{ color: volunteer[dayPreference] ? undefined : '#CCC' }}>
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VolunteerDetails;
