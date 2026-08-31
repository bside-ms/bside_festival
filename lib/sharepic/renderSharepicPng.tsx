import formatSharepicAppearances from '@/lib/sharepic/formatSharepicAppearances';
import type { SharepicEntry } from '@/lib/sharepic/getSharepicEntry';
import { sharepicFormats, type SharepicFormat, type SharepicLang } from '@/lib/sharepic/sharepicFormats';
import SharepicMarkup from '@/lib/sharepic/SharepicMarkup';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const extraBoldPath = join(process.cwd(), 'public/fonts/BricolageGrotesque-ExtraBold.ttf');
const boldPath = join(process.cwd(), 'public/fonts/BricolageGrotesque-Bold.ttf');
const logoSvgPath = join(process.cwd(), 'images/2026/logo_transparent.svg');

let extraBoldFont: Buffer | undefined;
let boldFont: Buffer | undefined;
let logoSrc: string | undefined;

const loadFonts = async (): Promise<{ bold: Buffer; extraBold: Buffer }> => {
    extraBoldFont ??= await readFile(extraBoldPath);
    boldFont ??= await readFile(boldPath);

    return { bold: boldFont, extraBold: extraBoldFont };
};

const inlineLogoSvgFills = (svg: string): string =>
    svg
        .replace(/<style>[\s\S]*?<\/style>/, '')
        .replaceAll('class="cls-1"', 'fill="#020300"')
        .replaceAll('class="cls-2"', 'fill="#fabf74"')
        .replaceAll('class="cls-3"', 'fill="#fff"')
        .replaceAll('class="cls-4"', 'fill="#222221"');

const loadLogoSrc = async (): Promise<string> => {
    if (logoSrc !== undefined) {
        return logoSrc;
    }

    const svg = inlineLogoSvgFills(await readFile(logoSvgPath, 'utf8'));
    const png = await sharp(Buffer.from(svg)).resize(400, 400).png().toBuffer();
    logoSrc = `data:image/png;base64,${png.toString('base64')}`;

    return logoSrc;
};

const loadPhotoSrc = async (photoUrl: string): Promise<string | null> => {
    try {
        const response = await fetch(photoUrl);

        if (!response.ok) {
            return null;
        }

        const input = Buffer.from(await response.arrayBuffer());
        const jpeg = await sharp(input).rotate().resize(1080, 1350, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();

        return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
    } catch {
        return null;
    }
};

const renderSharepicPng = async (
    entry: SharepicEntry,
    format: SharepicFormat,
    showPhoto: boolean,
    lang: SharepicLang,
): Promise<ImageResponse> => {
    const { height, width } = sharepicFormats[format];
    const [{ extraBold, bold }, resolvedLogoSrc] = await Promise.all([loadFonts(), loadLogoSrc()]);
    const photoSrc = showPhoto && entry.photoUrl !== null ? await loadPhotoSrc(entry.photoUrl) : null;

    return new ImageResponse(
        <SharepicMarkup
            appearances={formatSharepicAppearances(entry.scheduleEntries, lang)}
            canceled={entry.canceled}
            format={format}
            lang={lang}
            logoSrc={resolvedLogoSrc}
            name={entry.name}
            photoSrc={photoSrc}
        />,
        {
            fonts: [
                { data: extraBold, name: 'BricolageGrotesque', style: 'normal', weight: 800 },
                { data: bold, name: 'BricolageGrotesque', style: 'normal', weight: 700 },
            ],
            height,
            width,
        },
    );
};

export default renderSharepicPng;
