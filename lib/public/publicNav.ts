import isProgramPublished from '@/lib/participants/isProgramPublished';
import { compact } from 'lodash';

export type PublicNavLink = {
    external?: boolean;
    href: string;
    id: string;
    label: string;
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
            // { id: 'wo-und-wann', label: 'Wo & Wann', href: '/#wo-und-wann' },
            { id: 'ueber-uns', label: 'Über uns', href: '/#ueber-uns' },
            { id: 'awareness', label: 'Awareness', href: '/awareness' },
        ]),
    },
    {
        id: 'helfis',
        label: 'Helfis',
        links: [
            { id: 'anmelden', label: 'Anmelden', href: '/mithelfen' },
            { id: 'engelsystem', label: 'Engelsystem', href: 'https://festival26.support.b-side.ms', external: true },
        ],
    },
];
