import { NextRequest } from "next/server"
import verifyMotoradminJwt from '@/lib/next-auth/verifyMotoradminJwt';

export const POST = async (req: NextRequest): Promise<Response> => {
    const { error, decoded } = await verifyMotoradminJwt(req.headers.get('Authorization'));
    if (error) return error; // Chunking error...

    console.log('Decoded JWT:', decoded);
    const responseData = JSON.stringify({ 
        status: 'success', 
        message: 'Greetings from Next.js API route!', 
    });

    const contentLength = new TextEncoder().encode(responseData).length;
    return new Response(responseData, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': contentLength.toString(), // we need to deactivate chunking
        },
    });
};

export const GET = async (): Promise<Response> => {
    const responseData = JSON.stringify({ 
        status: 'success', 
        message: 'Greetings from Next.js API route!' 
    });
    const contentLength = new TextEncoder().encode(responseData).length;
    return new Response(responseData, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': contentLength.toString(), // we need to deactivate chunking
        },
    });
};
