export interface InternNavLink {
    href: string;
    id: 'contributions' | 'slotplan' | 'locations' | 'kuration' | 'applications' | 'program' | 'volunteers' | 'changelog';
    label: string;
}

export const internPrimaryNavIds: Array<InternNavLink['id']> = ['contributions', 'slotplan', 'locations', 'kuration'];

export const getInternNavLinks = (isInDataPrivacyGroup: boolean): Array<InternNavLink> => {
    const links: Array<InternNavLink> = [
        { href: '/intern', id: 'contributions', label: 'Programmbeiträge' },
        { href: '/intern/slotplan', id: 'slotplan', label: 'Slotplan' },
        { href: '/intern/slotplan?tab=locations', id: 'locations', label: 'Programmorte' },
        { href: '/intern/kuration', id: 'kuration', label: 'Kuration' },
        { href: '/bewerbungen', id: 'applications', label: 'Bewerbungsformular' },
        { href: '/programm/', id: 'program', label: 'Programmübersicht' },
        { href: '/mithelfen/uebersicht', id: 'volunteers', label: 'Helfer:innenübersicht' },
    ];

    if (isInDataPrivacyGroup) {
        links.push({ href: '/aenderungslog', id: 'changelog', label: 'Änderungslog' });
    }

    return links;
};

export const isInternNavLinkActive = (
    link: InternNavLink,
    pathname: string,
    searchParams: { get: (name: string) => string | null },
): boolean => {
    const tab = searchParams.get('tab');
    const from = searchParams.get('from');

    switch (link.id) {
        case 'contributions':
            return pathname === '/intern' || (/^\/intern\/\d+$/.test(pathname) && from !== 'slotplan');
        case 'slotplan':
            return pathname === '/intern/slotplan' && tab !== 'locations';
        case 'locations':
            return pathname === '/intern/slotplan' && tab === 'locations';
        case 'kuration':
            return pathname.startsWith('/intern/kuration');
        case 'applications':
            return pathname.startsWith('/bewerbungen');
        case 'program':
            return pathname.startsWith('/programm');
        case 'volunteers':
            return pathname.startsWith('/mithelfen');
        case 'changelog':
            return pathname.startsWith('/aenderungslog');
    }
};
