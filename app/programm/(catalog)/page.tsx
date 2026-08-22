import PublicProgramCatalog from '@/components/participants/publicProgram/PublicProgramCatalog';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import getPublicProgramEntries from '@/lib/participants/getPublicProgramEntries';
import isProgramPublished from '@/lib/participants/isProgramPublished';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

interface Props {
    searchParams: Promise<{ text?: string | Array<string> }>;
}

const ProgramPage = async ({ searchParams }: Props): Promise<ReactElement> => {
    const loggedIn = await isLoggedIn();

    if (!isProgramPublished && !loggedIn) {
        redirect('/');
    }

    const participants = await getPublicProgramEntries();
    const { text } = await searchParams;

    return <PublicProgramCatalog participants={participants} initialSearchText={typeof text === 'string' ? text : ''} />;
};

export default ProgramPage;
