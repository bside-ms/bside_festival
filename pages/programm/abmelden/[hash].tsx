import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import UnregisterInfo from 'components/unregister/UnregisterInfo';

export default (): ReactElement => {

    const router = useRouter();

    const { hash } = router.query as { hash?: string };

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Programm" />

            <PageHeader theme="pink" symbols="hearts" />

            <div className="bg-gray-800 min-h-screen">
                <div className="pt-[220px] bg-white">
                    <ContentWrapper>
                        <div>
                            {hash !== undefined && <UnregisterInfo hash={hash} />}
                        </div>
                    </ContentWrapper>
                </div>

                <Footer />
            </div>
        </>
    );
};
