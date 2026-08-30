import { confirmWorkshopAttendee } from '@/lib/actions/workshopAttendeeActions';
import { NextResponse } from 'next/server';

interface Props {
    params: Promise<{ token: string }>;
}

export const GET = async (request: Request, { params }: Props): Promise<NextResponse> => {
    const { token } = await params;
    await confirmWorkshopAttendee(token);

    return NextResponse.redirect(new URL(`/programm/anmeldung/bestaetigen/${token}`, request.url));
};
