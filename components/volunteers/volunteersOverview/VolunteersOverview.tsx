import type { Volunteer } from '@prisma/client';
import Link from 'next/link';
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

    const portalLink = (
        <Link
            href="https://portal.b-side.ms/group/284ef230-f3f0-4368-a895-334ed02ff59a"
            className="underline cursor-pointer"
            target="_blank"
        >
            Datenschutz-Gruppe
        </Link>
    );

    return (
        <div>
            <div className="text-3xl mb-5 font-display">
                Helfer:innen ({volunteers.length})
            </div>

            <div className="rounded-md drop-shadow bg-gray-50 p-2 mb-3">
                Die Kontakt-Daten der Helfer:innen sind nur für Mitglieder
                der {portalLink} des Festivals sichtbar.
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
