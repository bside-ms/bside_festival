import { NextResponse } from 'next/server';
import verifyMotoradminJwt from '@/lib/next-auth/verifyMotoradminJwt';

export const POST = async (req: Request): Promise<NextResponse> => {
    const { error, decoded } = await verifyMotoradminJwt(req.headers.get('Authorization'));
    if (error) return error;

    console.log('POST request received at /api/motoradmin with body: ', await req.json(), decoded);
    return NextResponse.json({ status: 'ok', body: decoded });
};
export const GET = async (): Promise<NextResponse> => NextResponse.json({ status: 'lel' });
