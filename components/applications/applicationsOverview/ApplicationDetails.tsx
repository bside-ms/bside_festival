import { useCallback, useState } from 'react';
import { faEnvelope, faFilePdf, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Link } from '@prisma/client';
import Image from 'next/image';
import { default as NextLink } from 'next/link';
import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import typeLabels from 'lib/participants/typeLabels';
import createPublicObjectUrl from 'lib/upload/createPublicObjectUrl';
import type { SerializableParticipant } from 'pages/bewerbungen/[idAndName]';

interface Props {
    application: SerializableParticipant;
    links: Array<Link>;
}

const ApplicationDetails = ({
    application: {
        name,
        type,
        description,
        contactName,
        contactPhone,
        contactMail,
        imageFileName,
        technicalRider,
        technicalRiderFileName,
        motivation,
        residence,
    },
    links,
}: Props): ReactElement => {

    const imageUrl = isEmptyString(imageFileName) ? null : createPublicObjectUrl(imageFileName);
    const technicalRiderPdfUrl = isEmptyString(technicalRiderFileName) ? null : createPublicObjectUrl(technicalRiderFileName);

    const [showEnhancedImage, setShowEnhancedImage] = useState(false);
    const toggleEnhancedImage = useCallback(() => setShowEnhancedImage(prevState => !prevState), []);

    return (
        <div className="p-3 rounded-md shadow-lg relative text-gray-800">
            {isNotEmptyString(imageUrl) && (
                <div
                    className={`${showEnhancedImage ? 'h-96 md:h-[600px]' : ''} w-full h-32 md:h-52 relative rounded-md overflow-hidden mb-2`}
                >
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill={true}
                        className="object-contain"
                        onClick={toggleEnhancedImage}
                    />

                    <div
                        className="bg-center bg-contain backdrop-blur-2xl bg-no-repeat absolute top-0 right-0 bottom-0 left-0"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                </div>
            )}

            <div className="uppercase text-sm text-gray-600">{typeLabels[type]}</div>

            <div className="text-xl">{name}</div>

            {isNotEmptyString(description) && <div>{description}</div>}

            {isNotEmptyString(motivation) && (
                <div className="mt-4">
                    <div className="font-bold">Motivation</div>
                    <div>{motivation}</div>
                </div>
            )}

            {links.length > 0 && (
                <div className="mt-4">
                    {links.map(link => (
                        <div key={link.id} className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                            <NextLink
                                href={link.link}
                                target="_blank"
                                className="cursor-pointer text-sky-700"
                            >
                                {link.link}
                            </NextLink>
                        </div>
                    ))}
                </div>
            )}

            {(isNotEmptyString(residence) || isNotEmptyString(contactName) || isNotEmptyString(contactMail) || isNotEmptyString(contactPhone)) && (
                <div className="mt-4">
                    {isNotEmptyString(residence) && (
                        <div className="flex items-center">
                            <div className="shrink-0 text-center w-4 mr-2 text-sm"><FontAwesomeIcon icon={faLocationDot} /></div>
                            <div>{residence}</div>
                        </div>
                    )}
                    {isNotEmptyString(contactName) && (
                        <div className="flex items-center">
                            <div className="shrink-0 text-center w-4 mr-2 text-sm"><FontAwesomeIcon icon={faUser} /></div>
                            <div>{contactName}</div>
                        </div>
                    )}
                    {isNotEmptyString(contactMail) && (
                        <div className="flex items-center">
                            <div className="shrink-0 text-center w-4 mr-2 text-sm"><FontAwesomeIcon icon={faEnvelope} /></div>
                            <div>{contactMail}</div>
                        </div>
                    )}
                    {isNotEmptyString(contactPhone) && (
                        <div className="flex items-center">
                            <div className="shrink-0 text-center w-4 mr-2 text-sm"><FontAwesomeIcon icon={faPhone} /></div>
                            <div>{contactPhone}</div>
                        </div>
                    )}
                </div>
            )}

            {(isNotEmptyString(technicalRider) || isNotEmptyString(technicalRiderPdfUrl)) && (
                <div className="mt-4">
                    <div className="font-bold">Technical Rider</div>
                    {isNotEmptyString(technicalRider) && (
                        <div>{technicalRider}</div>
                    )}
                    {isNotEmptyString(technicalRiderPdfUrl) && (
                        <NextLink href={technicalRiderPdfUrl}>
                            <FontAwesomeIcon icon={faFilePdf} />
                        </NextLink>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApplicationDetails;
