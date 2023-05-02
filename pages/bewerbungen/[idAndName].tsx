import { useState } from 'react';
import process from 'process';
import type { Participant } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import type { ReactElement } from 'react';
import ApplicationDetails from 'components/applications/applicationsOverview/ApplicationDetails';
import fetcher from 'lib/common/fetcher';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import getUserSession from 'lib/next-auth/getUserSession';
import type { GetApplicationResponse } from 'pages/api/applications/[id]';

const BackLink = (): ReactElement => {

    const [backLink, setBackLink] = useState<string | null>(null);

    useEffectOnMount(() => {

        const url = new URL(window.location.href);

        url.pathname = '/bewerbungen/uebersicht';

        setBackLink(url.toString());
    });

    return (
        <Link
            href={backLink?.toString() ?? ''}
            className="text-gray-800 underline md:cursor-pointer md:hover:text-gray-700"
        >
            zurück
        </Link>
    );
};

interface Props {
    application: Participant;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {

    const userSession = await getUserSession(context);

    if (userSession === null || context.params === undefined) {
        return {
            redirect: {
                statusCode: 302,
                destination: '/',
            },
        };
    }

    const idAndName = context.params.idAndName as string | undefined;

    const id = /^\d+/.exec(idAndName ?? '')?.[0] ?? null;

    if (id === null) {
        return { notFound: true };
    }

    const url = new URL(process.env.APP_URL);
    url.pathname = `/api/applications/${id}`;

    const { application } = await fetcher(url.toString()) as GetApplicationResponse;

    if (application === null) {
        return { notFound: true };
    }

    return {
        props: { application },
    };
};

export default ({ application }: Props): ReactElement => {

    return (
        <div className="p-7">
            <BackLink />

            <ApplicationDetails
                application={application}
            />
        </div>
    );
};
