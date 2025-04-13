import type { Volunteer } from '@prisma/client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import VolunteerDetails from 'components/volunteers/volunteersOverview/VolunteerDetails';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';

interface Props {
    volunteers: Array<Volunteer>;
}

const VolunteersOverview = ({ volunteers }: Props): ReactElement => {
    const { data: session } = useSession();

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const portalLink = (
        <Link
            href="https://portal.b-side.ms/group/284ef230-f3f0-4368-a895-334ed02ff59a"
            className="cursor-pointer underline"
            target="_blank"
        >
            Datenschutz-Gruppe
        </Link>
    );

    return (
        <div>
            <div className="mb-5 font-display text-3xl">Helfer:innen ({volunteers.length})</div>

            {volunteers.length === 0 ? (
                <div className="mt-3 rounded-md bg-gray-50 p-2 drop-shadow">Bisher sind keine Helfer:innen-Anmeldungen eingegangen</div>
            ) : (
                <>
                    <div className="mb-3 rounded-md bg-gray-50 p-2 drop-shadow">
                        Die Kontakt-Daten der Helfer:innen sind nur für Mitglieder der {portalLink} des Festivals sichtbar.
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {volunteers.map((volunteer) => (
                            <VolunteerDetails key={volunteer.int} volunteer={volunteer} showSensitiveData={isInDataPrivacyGroup} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default VolunteersOverview;
