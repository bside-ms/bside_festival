'use client';

import ActivityTimeline from '@/components/intern/ActivityTimeline';
import AddCommentForm from '@/components/intern/AddCommentForm';
import { useInternWorkspaceContext } from '@/components/intern/InternWorkspaceContext';
import OrganizerAssignment from '@/components/intern/OrganizerAssignment';
import StatusTransitionPanel from '@/components/intern/StatusTransitionPanel';
import ApplicationDetails from '@/components/applications/applicationDetails/ApplicationDetails';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
    onCloseClick: () => void;
}

const ProgrammbeitragDetails = ({ application, onCloseClick }: Props): ReactElement => {
    const { getGenres, getLinks, getZipcodes } = useInternWorkspaceContext();

    return (
        <div className="grid gap-4 border-t border-black bg-white p-3 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
                <ApplicationDetails
                    application={application}
                    genres={getGenres(application.id)}
                    links={getLinks(application.id)}
                    zipcodes={getZipcodes(application.id)}
                    onCloseClick={onCloseClick}
                    showBottomClose={false}
                    showCuration={false}
                />
            </div>

            <aside className="space-y-5 self-start rounded-md border border-black bg-gray-50 p-3 lg:sticky lg:top-3">
                <div className="space-y-2">
                    <div className="font-display text-xl">Status</div>
                    <StatusTransitionPanel currentStatus={application.status} participantId={application.id} />
                </div>

                <OrganizerAssignment application={application} />

                <ActivityTimeline comments={application.comments} />

                <AddCommentForm participantId={application.id} />
            </aside>
        </div>
    );
};

export default ProgrammbeitragDetails;
