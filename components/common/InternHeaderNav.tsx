import InternHeaderNavBar from '@/components/common/InternHeaderNavBar';
import { getInternNavLinks } from '@/lib/intern/internNavLinks';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import getUserSession from '@/lib/next-auth/getUserSession';
import type { ReactElement } from 'react';
import { Suspense } from 'react';

const InternHeaderNav = async (): Promise<ReactElement> => {
    const userSession = await getUserSession();
    const isInDataPrivacyGroup = userSession?.keycloakGroups?.includes(dataPrivacyGroup) ?? false;

    return (
        <Suspense fallback={null}>
            <InternHeaderNavBar
                links={getInternNavLinks(isInDataPrivacyGroup)}
                userIdentifier={userSession === null ? null : (userSession.name ?? userSession.email ?? 'unbekannt')}
            />
        </Suspense>
    );
};

export default InternHeaderNav;
