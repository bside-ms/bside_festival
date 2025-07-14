import VolunteersOverview from '@/components/volunteers/volunteersOverview/VolunteersOverview';
import prismaClient from '@/lib/common/prismaClient';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const volunteers = await prismaClient.volunteer.findMany();

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-7xl px-2 pt-5 pb-3 font-display">
            <VolunteersOverview volunteers={volunteers} isInDataPrivacyGroup={isInDataPrivacyGroup} />
        </div>
    );
};
