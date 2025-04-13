import type { ReactElement } from 'react';
import ApplicationTypeSelection from '../../components/applications/applicationForm/ApplicationTypeSelection';
import BackgroundImage from '../../components/common/BackgroundImage';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import { getServerSession } from 'next-auth';
import authOptions from '../../lib/next-auth/authOptions';
import { redirect } from 'next/navigation';

async function getData() {
    const session = await getServerSession(authOptions);

    if (session === null) {
        redirect('/');
    }

    return {};
}

export default async function BewerbungenPage(): Promise<ReactElement> {
    await getData();

    return (
        <div>
            <div className="relative min-h-screen w-full ">
                <div className="relative z-10">
                    <div className="mx-auto w-full max-w-[700px] md:w-2/3 md:pt-2">
                        <Header />
                    </div>

                    <div className="mx-auto w-full max-w-[700px] p-5 drop-shadow-xl md:w-2/3 md:p-8">
                        <div className="flex w-full flex-col gap-6">
                            <div className="font-display text-black">
                                <div className="text-4xl font-bold">Bewerbung</div>
                            </div>

                            <div className="font-bold text-black">
                                Auf dem B-Side Festival gibt es viele verschiedenen Formate. Damit wir den Überblick behalten, haben wir auf
                                dieser Seite verschiedene Bewerbungsformulare zusammengestellt. Such dir einfach das Genre raus, das am
                                ehesten zu deinem Programmpunkt passt.
                            </div>

                            <ApplicationTypeSelection />
                        </div>
                    </div>
                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
} 