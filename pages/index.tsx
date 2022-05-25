import Link from 'next/link';
import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import Login from 'components/common/Login';
import PageHeader from 'components/common/PageHeader';
import ApplicationEyecatcher from 'components/front-page/ApplicationEyecatcher';
import FestivalSentiment from 'components/front-page/FestivalSentiment';

export default (): ReactElement => {

    return (
        <>
            <PageHeader theme="yellow" />

            <ApplicationEyecatcher />

            <Login />

            <div>
                <Link href="/bewerbung/uebersicht">
                    <a>zur Übersicht</a>
                </Link>
            </div>

            <FestivalSentiment />

            <Footer />
        </>
    );
};
