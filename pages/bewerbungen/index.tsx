import { useCallback } from 'react';
import * as process from 'process';
import type { Participant } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import useSwr from 'swr';
import ApplicationForm from 'components/participants/applicationForm/ApplicationForm';
import ApplicationsOverview from 'components/participants/applicationsOverview/ApplicationsOverview';
import fetcher from 'lib/common/fetcher';
import type { GetAllParticipantsResponse } from 'pages/api/participants/all';

interface Props {
    participants: Array<Participant>;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {

    const url = new URL(process.env.APP_URL);
    url.pathname = '/api/participants/all';

    const { participants } = await fetcher(url.toString()) as GetAllParticipantsResponse;

    return {
        props: { participants },
    };
};

export default ({ participants: initialData }: Props): ReactElement => {

    const { data, mutate } = useSwr<GetAllParticipantsResponse>(
        '/api/participants/all',
        fetcher,
    );

    const usedData = data?.participants ?? initialData;

    const handleSubmit = useCallback(
        (newParticipant: Participant) => mutate({
            participants: [
                ...usedData,
                newParticipant,
            ],
        }),
        [mutate, usedData]
    );

    return (
        <div className="p-7">
            <ApplicationsOverview
                applications={usedData}
            />

            <ApplicationForm
                onSuccessfulFormSubmit={handleSubmit}
            />
        </div>
    );
};
