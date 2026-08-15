import isProgramPublished from '@/lib/participants/isProgramPublished';
import { compact } from 'lodash';

export type PublicNavLink = {
    id: string;
    label: string;
    href: string;
};

export type PublicNavGroup = {
    id: string;
    label: string;
    links: PublicNavLink[];
};

export const getProgrammNavLink = (): PublicNavLink | null => {
    if (!isProgramPublished) {
        return null;
    }

    return { id: 'programm', label: 'Programm', href: '/programm' };
};

export const getPublicNavGroups = (): PublicNavGroup[] => [
    {
        id: 'festival-2026',
        label: 'Festival 2026',
        links: compact([
            getProgrammNavLink(),
            { id: 'wo-und-wann', label: 'Wo & Wann', href: '/#wo-und-wann' },
            { id: 'ueber-uns', label: 'Über uns', href: '/#ueber-uns' },
            { id: 'awareness', label: 'Awareness', href: '/awareness' },
        ]),
    },
    {
        id: 'mitwirken',
        label: 'Mitwirken',
        links: [{ id: 'helfis', label: 'Helfis', href: '/mithelfen' }],
    },
];
