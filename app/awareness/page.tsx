import AwarenessInformation from '@/components/awareness/AwarenessInformation';
import AwarenessPageLayout from '@/components/awareness/AwarenessPageLayout';
import type { ReactElement } from 'react';

const AwarenessPage = (): ReactElement => {
    return (
        <AwarenessPageLayout
            eyebrow="Awareness & Safety"
            title="Awareness auf dem B-Side Festival"
            toggles={[
                { href: '/awareness/leichte-sprache', label: 'Leichte Sprache' },
                { href: '/awareness/english', label: 'English' },
            ]}
        >
            <AwarenessInformation />
        </AwarenessPageLayout>
    );
};

export default AwarenessPage;
