import SharepicStudio from '@/components/sharepic/SharepicStudio';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import isProgramPublished from '@/lib/participants/isProgramPublished';
import getSharepicEntry from '@/lib/sharepic/getSharepicEntry';
import { parseSharepicFormat, parseSharepicLang, parseSharepicShowPhoto } from '@/lib/sharepic/sharepicFormats';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import type { ReactElement } from 'react';

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ format?: string; lang?: string; photo?: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const entry = await getSharepicEntry(Number((await params).id));

    if (entry === null) {
        return { robots: { index: false }, title: 'Sharepic' };
    }

    return {
        robots: { index: false },
        title: `Sharepic · ${entry.name}`,
    };
};

const SharepicPage = async ({ params, searchParams }: Props): Promise<ReactElement> => {
    if (!isProgramPublished && !(await isLoggedIn())) {
        redirect('/');
    }

    const entry = await getSharepicEntry(Number((await params).id));

    if (entry === null) {
        notFound();
    }

    const query = await searchParams;
    const format = parseSharepicFormat(query.format ?? null);
    const showPhoto = parseSharepicShowPhoto(query.photo ?? null) && entry.hasPhoto;
    const lang = parseSharepicLang(query.lang ?? null);

    return (
        <SharepicStudio
            canceled={entry.canceled}
            format={format}
            hasPhoto={entry.hasPhoto}
            id={entry.id}
            lang={lang}
            name={entry.name}
            showPhoto={showPhoto}
        />
    );
};

export default SharepicPage;
