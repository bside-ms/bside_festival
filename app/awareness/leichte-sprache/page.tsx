import AwarenessEasyGerman from '@/components/awareness/AwarenessEasyGerman';
import AwarenessPageLayout from '@/components/awareness/AwarenessPageLayout';
import type { ReactElement } from 'react';

const AwarenessLeichteSprachePage = (): ReactElement => {
    return (
        <AwarenessPageLayout
            eyebrow="Awareness"
            title="Awareness – HILFE – auf dem B-Side Festival"
            toggles={[
                { href: '/awareness', label: 'Awareness-Konzept' },
                { href: '/awareness/english', label: 'English' },
            ]}
        >
            <AwarenessEasyGerman />
        </AwarenessPageLayout>
    );
};

export default AwarenessLeichteSprachePage;
