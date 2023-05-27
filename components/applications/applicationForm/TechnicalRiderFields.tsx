import { useCallback, useRef, useState } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bytes from 'bytes';
import { uniqueId } from 'lodash';
import type { ChangeEvent, ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from 'components/applications/applicationForm/ApplicationForm';
import TextArea from 'components/form/TextArea';
import blobToDataUrl from 'lib/common/helper/blobToDataUrl';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';

const fileFieldName: keyof ApplicationFormValues = 'encodedTechnicalRiderPdf';
const maxFileSize = bytes('20MB');

const allowedPdfFileType = 'application/pdf';

const TechnicalRiderFields = (): ReactElement => {

    const { register, setValue, formState, watch, setError, clearErrors } = useFormContext<ApplicationFormValues>();

    const errorMessage = formState.errors.encodedImage?.message;

    const [currentFileName, setCurrentFileName] = useState<string | null>(null);

    const handleFileChange = useCallback(async ({ target }: ChangeEvent<HTMLInputElement>) => {

        clearErrors(fileFieldName);

        if (target.files === null || target.files[0] === undefined) {
            return;
        }

        const file = target.files[0];

        if (file.type !== allowedPdfFileType) {
            setValue(fileFieldName, '');
            setCurrentFileName(null);
            setError(
                fileFieldName,
                { message: 'Bitte wähle eine PDF-Datei aus' }
            );
            return;
        }

        if (file.size > maxFileSize) {
            setValue(fileFieldName, '');
            setCurrentFileName(null);
            setError(
                fileFieldName,
                { message: `Max. ${bytes.format(maxFileSize, { unitSeparator: '', unit: 'MB' })} zulässig` }
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

    const fileInputId = useRef(uniqueId('file-upload'));

    return (
        <div className="flex flex-col gap-1 relative">
            <TextArea<ApplicationFormValues>
                name="technicalRider"
                label="Technical Rider"
                info={`
                    Welche Instrumente habt ihr auf der Bühne? Welche technische Ausstattung 
                    braucht ihr (Verstärker, Mikrofone, etc.)? Kennzeichnet was 
                    ihr selber mitbringt und was ihr von uns braucht. Reiche den Technical Rider alternativ als PDF ein.
                `}
                required={true}
            />

            <input type="hidden" {...register(fileFieldName)} />

            <input
                id={fileInputId.current}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept={allowedPdfFileType}
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

            {typeof errorMessage === 'string' && (
                <div className="px-1 text-rose-700">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default TechnicalRiderFields;
