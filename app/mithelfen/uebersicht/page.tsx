import type { ReactElement } from 'react';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import VolunteersOverview from 'components/volunteers/volunteersOverview/VolunteersOverview';
import prismaClient from 'lib/common/prismaClient';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import { redirect } from 'next/navigation';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';
import isLoggedIn from 'lib/next-auth/isLoggedIn';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const volunteers = await prismaClient.volunteer.findMany();

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    return (
        <div>
            <div className="relative min-h-screen w-full pb-16">
                <div className="relative z-10">
                    <div className="mx-auto max-w-2xl p-3">
                        <Header />
                    </div>

                    <div className="mx-auto max-w-2xl px-3">
                        <VolunteersOverview volunteers={volunteers} isInDataPrivacyGroup={isInDataPrivacyGroup} />
                    </div>
                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
