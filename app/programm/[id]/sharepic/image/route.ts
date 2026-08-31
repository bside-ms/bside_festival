import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import isProgramPublished from '@/lib/participants/isProgramPublished';
import getSharepicEntry from '@/lib/sharepic/getSharepicEntry';
import renderSharepicPng from '@/lib/sharepic/renderSharepicPng';
import sharepicFileName from '@/lib/sharepic/sharepicFileName';
import { parseSharepicFormat, parseSharepicLang, parseSharepicShowPhoto } from '@/lib/sharepic/sharepicFormats';
import { NextResponse } from 'next/server';

interface Props {
    params: Promise<{ id: string }>;
}

export const GET = async (request: Request, { params }: Props): Promise<Response> => {
    if (!isProgramPublished && !(await isLoggedIn())) {
        return new NextResponse('Not Found', { status: 404 });
    }

    const id = Number((await params).id);
    const entry = await getSharepicEntry(id);

    if (entry === null) {
        return new NextResponse('Not Found', { status: 404 });
    }

    const searchParams = new URL(request.url).searchParams;
    const format = parseSharepicFormat(searchParams.get('format'));
    const showPhoto = parseSharepicShowPhoto(searchParams.get('photo')) && entry.hasPhoto;
    const lang = parseSharepicLang(searchParams.get('lang'));
    const download = searchParams.get('download') === '1';
    const image = await renderSharepicPng(entry, format, showPhoto, lang);
    const body = await image.arrayBuffer();
    const headers = new Headers({
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Content-Type': 'image/png',
    });

    if (download) {
        headers.set('Content-Disposition', `attachment; filename="${sharepicFileName(entry.name)}"`);
    }

    return new NextResponse(body, { headers });
};
