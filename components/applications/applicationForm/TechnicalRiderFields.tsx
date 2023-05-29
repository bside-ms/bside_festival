import { useCallback, useRef, useState } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Type } from '@prisma/client';
import bytes from 'bytes';
import { uniqueId } from 'lodash';
import type { ChangeEvent, ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from 'components/applications/applicationForm/ApplicationForm';
import TextArea from 'components/form/TextArea';
import blobToDataUrl from 'lib/common/helper/blobToDataUrl';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';

const fileFieldName: keyof ApplicationFormValues = 'encodedTechnicalRiderPdf';

export const getTechnicalRiderInfo = (applicationType: Type): null | { info: string, required?: boolean } => {

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
                    Welche Instrumente habt ihr auf der Bühne? Welche technische Ausstattung 
                    braucht ihr? Zum Beispiel Verstärker, Mikrofone, Licht, … Wie viel Platz 
                    braucht ihr auf der Bühne? Seid so genau wie möglich. Kennzeichnet was 
                    ihr selber mitbringt und was ihr von uns braucht. Ladet optional zusätzlich
                    eine PDF-Datei hoch.
                `,
                required: true,
            };

        case Type.Reading:
            return {
                info: 'Welche technische Ausstattung braucht ihr? Alternativ könnt ihr hierfür auch eine PDF-Datei hochladen',
            };

        case Type.Workshop:
            return {
                info: 'Welche technische Ausstattung braucht ihr? Alternativ könnt ihr hierfür auch eine PDF-Datei hochladen',
            };

        default:
            return null;
    }
};

export const allowedTechnicRiderContentType = 'application/pdf';
export const allowedTechnicalRiderMaxFileSize = bytes('20MB');

const TechnicalRiderFields = (): ReactElement | null => {

    const { register, setValue, formState, watch, setError, clearErrors } = useFormContext<ApplicationFormValues>();

    const technicalRiderErrorMessage = formState.errors.technicalRider?.message;
    const technicalRiderPdfErrorMessage = formState.errors.encodedTechnicalRiderPdf?.message;

    const [currentFileName, setCurrentFileName] = useState<string | null>(null);

    const handleFileChange = useCallback(async ({ target }: ChangeEvent<HTMLInputElement>) => {

        clearErrors(['technicalRider', fileFieldName]);

        if (target.files === null || target.files[0] === undefined) {
            return;
        }

        const file = target.files[0];

        if (file.type !== allowedTechnicRiderContentType) {
            setValue(fileFieldName, '');
            setCurrentFileName(null);
            setError(
                fileFieldName,
                { message: 'Bitte wähle eine PDF-Datei aus' }
            );
            return;
        }

        if (file.size > allowedTechnicalRiderMaxFileSize) {
            setValue(fileFieldName, '');
            setCurrentFileName(null);
            setError(
                fileFieldName,
                { message: `Max. ${bytes.format(allowedTechnicalRiderMaxFileSize, { unitSeparator: '', unit: 'MB' })} zulässig` }
            );
            return;
        }

        const fileDataUrl = await blobToDataUrl(file);

        if (typeof fileDataUrl === 'string') {
            setValue(fileFieldName, fileDataUrl);
            setCurrentFileName(file.name);
        }

    }, [clearErrors, setError, setValue]);

    const handleFileRemove = useCallback(
        () => setValue(fileFieldName, ''),
        [setValue]
    );

    const currentFileDataUrl = watch(fileFieldName);
    const currentApplicationType = watch('type');

    const fileInputId = useRef(uniqueId('file-upload'));

    const technicalRiderInfo = getTechnicalRiderInfo(currentApplicationType);

    if (technicalRiderInfo === null) {
        return null;
    }

    const { info, required } = technicalRiderInfo;

    return (
        <div className="flex flex-col gap-1 relative">
            <TextArea<ApplicationFormValues>
                name="technicalRider"
                // We do not use `required` of `TextArea` since PDF is fine as well, it's handled manually
                label={required === true ? 'Technical Rider *' : 'Technical Rider'}
                info={info}
            />

            <input type="hidden" {...register(fileFieldName)} />

            <input
                id={fileInputId.current}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept={allowedTechnicRiderContentType}
            />

            <div className="text-gray-100">
                {isNotEmptyString(currentFileDataUrl) && isNotEmptyString(currentFileName) ? (
                    <div>
                        <span className="font-mono px-2">
                            {currentFileName}
                        </span>
                        <span
                            className="py-1 px-2 bg-gray-800 hover:bg-gray-700 text-gray-50 text-sm rounded-md cursor-pointer z-10"
                            onClick={handleFileRemove}
                        >
                            Entfernen&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faTrashAlt} />
                        </span>
                    </div>
                ) : (
                    <label htmlFor={fileInputId.current} className="cursor-pointer">
                        <div className="p-5 border border-dashed border-gray-100 flex justify-center items-center rounded">
                            PDF hinzufügen
                        </div>
                    </label>
                )}
            </div>

            {typeof technicalRiderPdfErrorMessage === 'string' && (
                <div className="px-1 text-rose-700">
                    {technicalRiderErrorMessage}
                </div>
            )}

            {typeof technicalRiderPdfErrorMessage === 'string' && (
                <div className="px-1 text-rose-700">
                    {technicalRiderErrorMessage}
                </div>
            )}
        </div>
    );
};

export default TechnicalRiderFields;
