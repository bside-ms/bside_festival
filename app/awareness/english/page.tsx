import AwarenessEnglishVersion from '@/components/awareness/AwarenessEnglishVersion';
import AwarenessPageLayout from '@/components/awareness/AwarenessPageLayout';
import type { ReactElement } from 'react';

const AwarenessEnglishPage = (): ReactElement => {
    return (
        <AwarenessPageLayout
            eyebrow="Awareness & Safety"
            lang="en"
            title="Awareness at the B-Side Festival"
            toggles={[
                { href: '/awareness', label: 'awareness concept' },
                { href: '/awareness/easy-language', label: 'easy language' },
            ]}
        >
            <AwarenessEnglishVersion />
        </AwarenessPageLayout>
    );
};

export default AwarenessEnglishPage;
