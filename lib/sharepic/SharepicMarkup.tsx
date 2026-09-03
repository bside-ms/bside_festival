import { sharepicFestivalDate, type SharepicAppearance } from '@/lib/sharepic/formatSharepicAppearances';
import { sharepicFormats, type SharepicFormat, type SharepicLang } from '@/lib/sharepic/sharepicFormats';
import type { CSSProperties, ReactElement } from 'react';

type SharepicMarkupProps = {
    appearances: Array<SharepicAppearance>;
    canceled: boolean;
    dripArrowSrc: string;
    format: SharepicFormat;
    lang: SharepicLang;
    logoSrc: string;
    name: string;
    photoSrc: string | null;
    swooshesSrc: string;
};

const navy = '#2C2E83';
const red = '#EA504C';

const columnStyle = (extra?: CSSProperties): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    ...extra,
});

const rowStyle = (extra?: CSSProperties): CSSProperties => ({
    display: 'flex',
    flexDirection: 'row',
    ...extra,
});

const nameFontSize = (name: string, inCard: boolean, isStory: boolean): number => {
    const base = inCard ? (isStory ? 110 : 96) : isStory ? 88 : 80;

    if (name.length > 48) {
        return Math.round(base * 0.55);
    }

    if (name.length > 32) {
        return Math.round(base * 0.7);
    }

    if (name.length > 20) {
        return Math.round(base * 0.85);
    }

    return base;
};

const SharepicMarkup = ({
    appearances,
    canceled,
    dripArrowSrc,
    format,
    lang,
    logoSrc,
    name,
    photoSrc,
    swooshesSrc,
}: SharepicMarkupProps): ReactElement => {
    const isStory = format === 'story';
    const { height, width } = sharepicFormats[format];
    const pad = isStory ? 52 : 40;
    const logoSize = isStory ? 180 : 132;
    const showPhoto = photoSrc !== null;
    const titleSize = nameFontSize(name, !showPhoto, isStory);
    const festivalSize = isStory ? 60 : 56;
    const festivalDateSize = isStory ? 45 : 42;
    const placeSize = isStory ? 56 : 52;
    const whenSize = isStory ? 52 : 48;
    const dripArrowSize = isStory ? 240 : 190;
    const swooshesSize = isStory ? 280 : 250;
    const headerTextMaxWidth = width - pad * 2 - logoSize - 16;

    return (
        <div
            style={columnStyle({
                backgroundImage: 'linear-gradient(160deg, #f4b6d6 0%, #f7cfe2 42%, #ffffff 100%)',
                fontFamily: 'BricolageGrotesque',
                height,
                padding: pad,
                width,
            })}
        >
            <div style={rowStyle({ alignItems: 'flex-start', flexShrink: 0, justifyContent: 'space-between', width: '100%' })}>
                <div style={columnStyle({ maxWidth: headerTextMaxWidth, paddingTop: 4 })}>
                    <div
                        style={{
                            color: red,
                            display: 'flex',
                            flexWrap: 'wrap',
                            fontSize: festivalSize,
                            fontWeight: 800,
                            lineHeight: 0.95,
                            textTransform: 'uppercase',
                        }}
                    >
                        B-Side Festival 2026
                    </div>
                    <div
                        style={{
                            color: navy,
                            display: 'flex',
                            fontSize: festivalDateSize,
                            fontWeight: 700,
                            lineHeight: 1.1,
                            marginTop: 10,
                        }}
                    >
                        {sharepicFestivalDate(lang)}
                    </div>
                </div>
                <img alt="" height={logoSize} src={logoSrc} width={logoSize} />
            </div>

            <div
                style={columnStyle({
                    flexGrow: 1,
                    flexShrink: 1,
                    marginTop: isStory ? 28 : 18,
                    minHeight: 0,
                    position: 'relative',
                    width: '100%',
                })}
            >
                <div
                    style={columnStyle({
                        alignItems: 'center',
                        backgroundColor: navy,
                        borderRadius: 20,
                        height: '100%',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        width: '100%',
                    })}
                >
                    {showPhoto ? (
                        <div style={{ display: 'flex', height: '100%', position: 'relative', width: '100%' }}>
                            <img
                                alt=""
                                height={900}
                                src={photoSrc}
                                style={{ height: '100%', objectFit: 'cover', width: '100%' }}
                                width={1080}
                            />
                            <div
                                style={{
                                    backgroundColor: 'rgba(44, 46, 131, 0.16)',
                                    display: 'flex',
                                    height: '100%',
                                    left: 0,
                                    position: 'absolute',
                                    top: 0,
                                    width: '100%',
                                }}
                            />
                        </div>
                    ) : (
                        <div
                            style={{
                                color: '#ffffff',
                                display: 'flex',
                                fontSize: titleSize,
                                fontWeight: 800,
                                justifyContent: 'center',
                                lineHeight: 0.95,
                                padding: isStory ? 48 : 36,
                                textAlign: 'center',
                                width: '100%',
                            }}
                        >
                            {name}
                        </div>
                    )}
                </div>

                <img
                    alt=""
                    height={dripArrowSize}
                    src={dripArrowSrc}
                    style={{ left: -18, position: 'absolute', top: -dripArrowSize * 0.14, transform: 'rotate(18deg)' }}
                    width={Math.round(dripArrowSize * (187 / 303))}
                />
                <img
                    alt=""
                    height={swooshesSize}
                    src={swooshesSrc}
                    style={{
                        bottom: isStory ? -120 : -100,
                        position: 'absolute',
                        right: -swooshesSize * 0.2,
                        transform: 'rotate(-6deg)',
                    }}
                    width={swooshesSize}
                />
            </div>

            {showPhoto && (
                <div
                    style={{
                        color: navy,
                        display: 'flex',
                        flexShrink: 0,
                        fontSize: titleSize,
                        fontWeight: 800,
                        lineHeight: 0.95,
                        marginTop: isStory ? 24 : 18,
                        width: '100%',
                    }}
                >
                    {name}
                </div>
            )}

            <div style={columnStyle({ flexShrink: 0, marginTop: isStory ? 24 : 16, width: '100%' })}>
                {canceled && (
                    <div
                        style={{
                            backgroundColor: navy,
                            color: '#ffffff',
                            display: 'flex',
                            fontSize: isStory ? 40 : 36,
                            fontWeight: 800,
                            marginBottom: 14,
                            padding: '12px 18px',
                            width: '100%',
                        }}
                    >
                        Fällt leider aus
                    </div>
                )}
                {appearances.map((appearance) => (
                    <div key={appearance.id} style={columnStyle({ marginBottom: 10, width: '100%' })}>
                        {appearance.when !== '' && (
                            <div style={{ color: navy, display: 'flex', fontSize: whenSize, fontWeight: 700, lineHeight: 1.15 }}>
                                {appearance.when}
                            </div>
                        )}
                        <div
                            style={{
                                color: navy,
                                display: 'flex',
                                fontSize: placeSize,
                                fontWeight: 800,
                                lineHeight: 1.1,
                                marginTop: appearance.when === '' ? 0 : 4,
                            }}
                        >
                            {appearance.place}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SharepicMarkup;
