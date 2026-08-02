'use client';

import ApplicationDetails from '@/components/applications/applicationDetails/ApplicationDetails';
import ActivityTimeline from '@/components/intern/ActivityTimeline';
import AddCommentForm from '@/components/intern/AddCommentForm';
import ContributionFeeEditor from '@/components/intern/ContributionFeeEditor';
import OrganizerAssignment from '@/components/intern/OrganizerAssignment';
import StatusTransitionPanel from '@/components/intern/StatusTransitionPanel';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { Genre, Link, Zipcode } from '@prisma/client';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
    genres: Array<Genre>;
    links: Array<Link>;
    zipcodes: Array<Zipcode>;
}

const noopClose = (): void => undefined;

const ContributionDetails = ({ application, genres, links, zipcodes }: Props): ReactElement => (
    <div className="grid gap-4 bg-white p-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
            <ApplicationDetails
                application={application}
                genres={genres}
                links={links}
                zipcodes={zipcodes}
                onCloseClick={noopClose}
                showName={false}
                showHeaderBadges={false}
                showBottomClose={false}
                showCuration={false}
            />
        </div>

        <aside className="space-y-5 self-start rounded-md border border-black bg-gray-50 p-3 lg:sticky lg:top-3">
            <div className="space-y-2">
                <div className="font-display text-xl">Status</div>
                <StatusTransitionPanel currentStatus={application.status} participantId={application.id} size="full" />
            </div>

            <OrganizerAssignment application={application} />

            <ContributionFeeEditor application={application} />

            <ActivityTimeline comments={application.comments} />

            <AddCommentForm participantId={application.id} />
        </aside>
    </div>
);

export default ContributionDetails;
