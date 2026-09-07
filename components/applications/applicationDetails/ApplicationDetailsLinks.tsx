import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import ApplicationLinkList from '@/components/applications/applicationForm/ApplicationLinkList';
import { updateApplicationLinks } from '@/lib/actions/applicationActions';
import { updateApplicationLinksSchema } from '@/lib/schemas/applicationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Link } from '@prisma/client';
import { default as NextLink } from 'next/link';
import { useCallback, useState, type ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CiGlobe } from 'react-icons/ci';
import { FaBandcamp, FaFacebook, FaInstagram, FaSoundcloud, FaSpotify, FaYoutube } from 'react-icons/fa';
import type { z } from 'zod';

const LinkBadge = ({ link }: { link: URL }): ReactElement => {
    if (link.hostname.includes('instagram.')) {
        return <FaInstagram title="Instagram" />;
    }

    if (link.hostname.includes('spotify.')) {
        return <FaSpotify title="Spotify" />;
    }

    if (link.hostname.includes('facebook.')) {
        return <FaFacebook title="Facebook" />;
    }

    if (link.hostname.includes('bandcamp.')) {
        return <FaBandcamp title="Bandcamp" />;
    }

    if (link.hostname.includes('soundcloud.')) {
        return <FaSoundcloud title="Soundcloud" />;
    }

    if (link.hostname.includes('youtube.') || link.hostname.includes('youtu.be')) {
        return <FaYoutube title="YouTube" />;
    }

    return (
        <>
            <CiGlobe /> <span className="text-sm">{link.hostname.replace(/^www./, '')}</span>
        </>
    );
};

const ExternalLink = ({ link: { isConfidential, link } }: { link: Link }): ReactElement => {
    const normalizedLink = /^https?:\/\//.test(link) ? link : `https://${link}`;

    return (
        <NextLink
            href={normalizedLink}
            target="_blank"
            className="inline-flex cursor-pointer items-center gap-1 rounded bg-gray-400/40 p-1 text-xl text-sky-400 hover:bg-gray-400/50"
        >
            <LinkBadge link={new URL(normalizedLink)} />
            <span className="text-xs text-black">{isConfidential ? 'privat' : 'öffentlich'}</span>
        </NextLink>
    );
};

interface Props {
    links: Array<Link>;
    participantId: number;
}

type FormValues = z.infer<typeof updateApplicationLinksSchema>;

const ApplicationDetailsLinks = ({ links, participantId }: Props): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const toggleShowForm = useCallback(() => setShowForm((value) => !value), []);
    const methods = useForm<FormValues>({
        defaultValues: {
            privateLinks: links.filter(({ isConfidential }) => isConfidential).map(({ link }) => ({ url: link })),
            publicLinks: links.filter(({ isConfidential }) => !isConfidential).map(({ link }) => ({ url: link })),
        },
        resolver: zodResolver(updateApplicationLinksSchema),
    });
    const {
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = methods;
    const onSubmit = useCallback(
        async (values: FormValues) => {
            try {
                await updateApplicationLinks(participantId, values);
                toggleShowForm();
            } catch {
                setError('root', { message: 'Fehler beim Submit!' });
            }
        },
        [participantId, setError, toggleShowForm],
    );

    if (showForm) {
        return (
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-3xl flex-col gap-4">
                    <ApplicationLinkList name="publicLinks" title="Öffentliche Links" />
                    <ApplicationLinkList name="privateLinks" title="Private Links" />
                    <ApplicationDetailsFormControls
                        errorMessage={errors.root?.message}
                        isSubmitting={isSubmitting}
                        onCancel={toggleShowForm}
                    />
                </form>
            </FormProvider>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            <div className="basis-full">
                <ApplicationDetailsTitle onEditClick={toggleShowForm}>Links</ApplicationDetailsTitle>
            </div>
            {links.length === 0 ? (
                <span className="text-gray-500">keine Angabe</span>
            ) : (
                links.map((link) => <ExternalLink key={link.id} link={link} />)
            )}
        </div>
    );
};

export default ApplicationDetailsLinks;
