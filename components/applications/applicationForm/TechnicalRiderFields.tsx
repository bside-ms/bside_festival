'use client';

import type { ApplicationFormValues } from '@/components/applications/applicationForm/ApplicationForm';
import TextArea from '@/components/form/TextArea';
import blobToDataUrl from '@/lib/common/helper/blobToDataUrl';
import cn from '@/lib/common/helper/cn';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import allowedTechnicRiderContentType from '@/lib/upload/allowedTechnicRiderContentType';
import allowedTechnicalRiderMaxFileSize from '@/lib/upload/allowedTechnicalRiderMaxFileSize';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Type } from '@prisma/client';
import bytes from 'bytes';
import { uniqueId } from 'lodash';
import type { ChangeEvent, ReactElement } from 'react';
import { useCallback, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const fileFieldName: keyof ApplicationFormValues = 'encodedTechnicalRiderPdf';

export const getTechnicalRiderInfo = (applicationType: Type): null | { info: string; withoutTextArea?: boolean; required?: boolean } => {
    switch (applicationType) {
        case Type.Exhibition:
            return {
                info: 'Welche technische Ausstattung braucht ihr? Alternativ könnt ihr hierfür auch eine PDF-Datei hochladen',
            };

        case Type.Performance:
            return {
                info: `
                    Welche technische Ausstattung braucht ihr? Zum Beispiel Mikrofone, Licht, … Wie viel Platz 
                    braucht ihr auf der Bühne? Seid so genau wie möglich. Kennzeichnet was 
                    ihr selber mitbringt und was ihr von uns braucht. Alternativ könnt ihr hierfür auch eine
                    PDF-Datei hochladen
                `,
                required: true,
            };

        case Type.Concert:
            return {
                info: `
                    Ladet uns bitte einen Technical Rider als PDF hoch, welcher eure technischen Anforderungen beschreibt.
                `,
                withoutTextArea: true,
                required: true,
            };

        case Type.Reading:
            return {
                info: 'Welche technische Ausstattung braucht ihr? Alternativ könnt ihr hierfür auch eine PDF-Datei hochladen',
            };

        case Type.Workshop:
        case Type.InfoBooth:
            return {
                info: 'Welche technische Ausstattung braucht ihr? Alternativ könnt ihr hierfür auch eine PDF-Datei hochladen',
            };

        default:
            return null;
    }
};

interface Props {
    chosenType: Type;
}

const TechnicalRiderFields = ({ chosenType }: Props): ReactElement | null => {
    const { register, setValue, formState, watch, setError, clearErrors } = useFormContext<ApplicationFormValues>();

    const technicalRiderErrorMessage = formState.errors.technicalRider?.message;
    const technicalRiderPdfErrorMessage = formState.errors.encodedTechnicalRiderPdf?.message;

    const [currentFileName, setCurrentFileName] = useState<string | null>(null);

    const handleFileChange = useCallback(
        async ({ target }: ChangeEvent<HTMLInputElement>) => {
            clearErrors(['technicalRider', fileFieldName]);

            if (target.files === null || target.files[0] === undefined) {
                return;
            }

            const file = target.files[0];

            if (file.type !== allowedTechnicRiderContentType) {
                setValue(fileFieldName, '');
                setCurrentFileName(null);
                setError(fileFieldName, { message: 'Bitte wähle eine PDF-Datei aus' });
                return;
            }

            if (file.size > allowedTechnicalRiderMaxFileSize) {
                setValue(fileFieldName, '');
                setCurrentFileName(null);
                setError(fileFieldName, {
                    message: `Max. ${bytes.format(allowedTechnicalRiderMaxFileSize, { unitSeparator: '', unit: 'MB' })} zulässig`,
                });
                return;
            }

            const fileDataUrl = await blobToDataUrl(file);

            if (typeof fileDataUrl === 'string') {
                setValue(fileFieldName, fileDataUrl);
                setCurrentFileName(file.name);
            }
        },
        [clearErrors, setError, setValue],
    );

    const handleFileRemove = useCallback(() => setValue(fileFieldName, ''), [setValue]);

    const currentFileDataUrl = watch(fileFieldName);

    const fileInputId = useRef(uniqueId('file-upload'));

    const technicalRiderInfo = getTechnicalRiderInfo(chosenType);

    if (technicalRiderInfo === null) {
        return null;
    }

    const { info, required, withoutTextArea } = technicalRiderInfo;

    const templateLink = '/assets/Tech-Rider-Vorlage.pdf';

    return (
        <div className="relative flex flex-col gap-1">
            {withoutTextArea === true ? (
                <>
                    <input type="hidden" {...register('technicalRider')} />
                    <label className="px-1 text-base text-white">{info}</label>
                </>
            ) : (
                <TextArea<ApplicationFormValues>
                    name="technicalRider"
                    // We do not use `required` of `TextArea` since PDF is fine as well, it's handled manually
                    label={required === true ? 'Technical Rider *' : 'Technical Rider'}
                    info={info}
                />
            )}

            <input type="hidden" {...register(fileFieldName)} />

            <input
                id={fileInputId.current}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept={allowedTechnicRiderContentType}
                tabIndex={-1}
            />

            <div className="text-white">
                {isNotEmptyString(currentFileDataUrl) && isNotEmptyString(currentFileName) ? (
                    <div>
                        <span className="px-2 font-mono">{currentFileName}</span>
                        <span
                            className="z-10 cursor-pointer rounded-md bg-gray-800 px-2 py-1 text-sm text-gray-50 hover:bg-gray-700"
                            onClick={handleFileRemove}
                        >
                            Entfernen&nbsp;&nbsp;&nbsp;
                            <FontAwesomeIcon className="inline-block w-4" icon={faTrashAlt} />
                        </span>
                    </div>
                ) : (
                    <label htmlFor={fileInputId.current} className="cursor-pointer">
                        <div
                            className={cn(
                                'flex w-full items-center justify-center rounded border border-dashed border-white p-5',
                                typeof technicalRiderErrorMessage === 'string' && 'bg-rose-400',
                            )}
                        >
                            <div
                                className={cn(
                                    'text-white opacity-55',
                                    typeof technicalRiderErrorMessage === 'string' && 'bg-rose-400 opacity-100',
                                )}
                            >
                                PDF hinzufügen {withoutTextArea === true && required === true && ' *'}
                            </div>
                        </div>
                    </label>
                )}
            </div>

            <div className="text-white">
                Solltet ihr selbst noch keinen Tech-Rider haben, nutzt bitte{' '}
                <a href={templateLink} target="_blank" className="cursor-pointer underline">
                    unsere Vorlage
                </a>
                , um unserer Technik-Crew viel Arbeit zu ersparen.
            </div>

            {typeof technicalRiderErrorMessage === 'string' && <div className="px-1 text-rose-600">{technicalRiderErrorMessage}</div>}

            {typeof technicalRiderPdfErrorMessage === 'string' && <div className="px-1 text-rose-600">{technicalRiderPdfErrorMessage}</div>}
        </div>
    );
};

export default TechnicalRiderFields;
