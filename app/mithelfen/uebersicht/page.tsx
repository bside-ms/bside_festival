import BackgroundImage from '@/components/common/BackgroundImage';
import VolunteersOverview from '@/components/volunteers/volunteersOverview/VolunteersOverview';
import prismaClient from '@/lib/common/prismaClient';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const volunteers = await prismaClient.volunteer.findMany();

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    return (
        <div className="relative min-h-screen w-full pb-16">
            <div className="relative z-10">
                <Link href="/" className="flex items-center gap-3">
                    <div className="pt-1 text-2xl md:pt-2 md:text-3xl">B-Side Festival 2025</div>
                </Link>

                <div className="mx-auto max-w-2xl px-3">
                    <VolunteersOverview volunteers={volunteers} isInDataPrivacyGroup={isInDataPrivacyGroup} />
                </div>
            </div>

            <BackgroundImage />
        </div>
    );
};
