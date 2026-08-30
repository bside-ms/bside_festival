import WorkshopCancellationConfirmation from '@/components/participants/attendeeForm/WorkshopCancellationConfirmation';
import { getWorkshopAttendeeCancellation } from '@/lib/actions/workshopAttendeeActions';
import type { ReactElement } from 'react';

interface Props {
    params: Promise<{ token: string }>;
}

const WorkshopAttendanceCancellationPage = async ({ params }: Props): Promise<ReactElement> => {
    const { token } = await params;
    const result = await getWorkshopAttendeeCancellation(token);

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-2xl px-5 pt-8 pb-12 md:px-8">
            <div className="flex w-full flex-col gap-6">
                <h1 className="font-display text-4xl font-bold">Teilnahme abmelden</h1>
                {result.available ? (
                    <>
                        <p className="leading-relaxed">
                            Möchtest du {result.attendeeName} wirklich vom Workshop „{result.participantName}“ abmelden? Der Platz wird
                            danach wieder freigegeben.
                        </p>
                        <WorkshopCancellationConfirmation token={token} />
                    </>
                ) : (
                    <p className={result.wasCancelled === true ? 'font-medium' : 'text-red-600'}>{result.message}</p>
                )}
            </div>
        </div>
    );
};

export default WorkshopAttendanceCancellationPage;
