import type { Volunteer } from '@prisma/client';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import VolunteerDetails from 'components/volunteers/volunteersOverview/VolunteerDetails';
import VolunteerDetailsLegend from 'components/volunteers/volunteersOverview/VolunteerDetailsLegend';
import isGroupMember from 'lib/next-auth/isGroupMember';

interface Props {
    volunteers: Array<Volunteer>;
}

const VolunteersOverview = ({ volunteers }: Props): ReactElement => {

    const { data: session } = useSession();

    const isInDataPrivacyGroup = isGroupMember('/kreise/festival/eingeschränkt/datenschutz', session);

    return (
        <div>
            <div className="text-3xl mb-5 font-display">
                Helfer:innen ({volunteers.length})
            </div>

            <div className="grid grid-cols-1 gap-3">
                {volunteers.map(volunteer => (
                    <VolunteerDetails
                        key={volunteer.int}
                        volunteer={volunteer}
                        showSensitiveData={isInDataPrivacyGroup}
                    />
                ))}
            </div>

            <div className="mt-8">
                <VolunteerDetailsLegend />
            </div>
        </div>
    );
};

export default VolunteersOverview;
