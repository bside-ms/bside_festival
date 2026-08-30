import { getWorkshopAttendeeVerification } from '@/lib/actions/workshopAttendeeActions';
import formatDate from '@/lib/common/helper/formatDate';
import type { ReactElement } from 'react';

interface Props {
    params: Promise<{ token: string }>;
}

const WorkshopAttendanceConfirmationPage = async ({ params }: Props): Promise<ReactElement> => {
    const result = await getWorkshopAttendeeVerification((await params).token);

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-2xl px-5 pt-8 pb-12 md:px-8">
            <div className="flex w-full flex-col gap-6">
                <h1 className="font-display text-4xl font-bold">Workshop-Teilnahme bestätigen</h1>
                {'wasConfirmed' in result && result.wasConfirmed === true ? (
                    <>
                        <p className="font-medium">Deine Workshop-Teilnahme ist bestätigt.</p>
                        {result.workshop !== undefined && (
                            <div className="bg-white p-5">
                                <h2 className="font-display text-2xl font-bold">{result.workshop.name}</h2>
                                {result.workshop.startsAt !== null && (
                                    <p className="mt-3 font-medium">
                                        {formatDate(result.workshop.startsAt, "EEEE, dd.MM. 'um' HH:mm 'Uhr'")}
                                    </p>
                                )}
                                <p className="font-medium">{result.workshop.programLocationName}</p>
                            </div>
                        )}
                        <p className="font-medium">Bitte sei pünktlich da, damit der Workshop für alle gut beginnen kann.</p>
                    </>
                ) : (
                    <p className="text-red-600">
                        {result.available ? 'Dieser Bestätigungslink ist noch nicht ausgeführt worden.' : result.message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default WorkshopAttendanceConfirmationPage;
