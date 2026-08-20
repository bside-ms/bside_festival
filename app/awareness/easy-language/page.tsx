import AwarenessEasyEnglish from '@/components/awareness/AwarenessEasyEnglish';
import AwarenessPageLayout from '@/components/awareness/AwarenessPageLayout';
import type { ReactElement } from 'react';

const AwarenessEasyLanguagePage = (): ReactElement => {
    return (
        <AwarenessPageLayout
            eyebrow="Information"
            lang="en"
            title="Awareness – HELP – at the B-Side Festival"
            toggles={[
                { href: '/awareness/english', label: 'Awareness-Concept' },
                { href: '/awareness/leichte-sprache', label: 'Leichte Sprache' },
            ]}
        >
            <AwarenessEasyEnglish />
        </AwarenessPageLayout>
    );
};

export default AwarenessEasyLanguagePage;
