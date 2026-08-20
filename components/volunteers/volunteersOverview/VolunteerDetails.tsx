import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import type { Volunteer } from '@prisma/client';
import type { ReactElement } from 'react';

interface Props {
    volunteer: Volunteer;
    showSensitiveData: boolean;
}

const VolunteerDetails = ({ volunteer, showSensitiveData }: Props): ReactElement => {
    return (
        <div className="rounded-md bg-white px-4 pt-2 pb-3 drop-shadow-sm">
            <div className="mb-2 flex flex-wrap items-center gap-2">
                <div className="text-xl">{volunteer.fullName}</div>
                {volunteer.emailVerified === null && (
                    <span className="rounded-full border border-amber-700 bg-amber-50 px-2 py-0.5 text-xs text-amber-800">
                        E-Mail unbestätigt
                    </span>
                )}
            </div>

            {showSensitiveData && (
                <div className="mb-1 text-base text-gray-600">
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

            <div className="mt-3">
                <div className="text-sm font-bold">Weitere Infos</div>
                {isNotEmptyString(volunteer.additionalInfo) ? (
                    <div className="mt-1 whitespace-pre-wrap">{volunteer.additionalInfo}</div>
                ) : (
                    <div className="mt-1 text-sm text-gray-500">Keine Angabe</div>
                )}
            </div>
        </div>
    );
};

export default VolunteerDetails;
