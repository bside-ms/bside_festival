import DatenExportWorkspace from '@/components/intern/datenExport/DatenExportWorkspace';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    if (!(await isGroupMember(dataPrivacyGroup))) {
        redirect('/intern');
    }

    return (
        <div className="relative mx-auto min-h-full w-full max-w-[90rem] px-2 pt-5 pb-3">
            <DatenExportWorkspace />
        </div>
    );
};
