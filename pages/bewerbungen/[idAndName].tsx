import { useState } from 'react';
import type { Link, Participant } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';
import ApplicationDetails from 'components/applications/applicationDetails/ApplicationDetails';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import prismaClient from 'lib/common/prismaClient';
import getUserSession from 'lib/next-auth/getUserSession';

const BackLink = (): ReactElement => {

    const [backLink, setBackLink] = useState<string | null>(null);

    useEffectOnMount(() => {

        const url = new URL(window.location.href);

        url.pathname = '/bewerbungen/uebersicht';

        setBackLink(url.toString());
    });

    return (
        <NextLink
            href={backLink?.toString() ?? ''}
            className="text-gray-800 underline md:cursor-pointer md:hover:text-gray-700"
        >
            zurück
        </NextLink>
    );
};

export type SerializableParticipant = Omit<Participant, 'appliedAt' | 'updatedAt'> & { updatedAt: string };

interface Props {
    application: SerializableParticipant;
    links: Array<Link>;
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

    const applicationId = /^\d+/.exec(idAndName ?? '')?.[0] ?? null;

    if (applicationId === null) {
        return { notFound: true };
    }

    const application = await prismaClient.participant.findUnique({ where: { id: Number(applicationId) } });

    if (application === null) {
        return { notFound: true };
    }

    const links = await prismaClient.link.findMany({ where: { participantId: Number(applicationId) } });

    return {
        props: {
            application: {
                ...application,
                appliedAt: application.appliedAt?.toString() ?? null,
                updatedAt: application.updatedAt.toString(),
            },
            links,
        },
    };
};

export default ({ application, links }: Props): ReactElement => {

    return (
        <div className="p-7">
            <BackLink />

            <ApplicationDetails
                application={application}
                links={links}
            />
        </div>
    );
};
