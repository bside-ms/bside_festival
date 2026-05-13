import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';

interface Props {
    errorMessage?: string;
    isSubmitting: boolean;
    onCancel: () => void;
}

const ApplicationDetailsFormControls = ({ errorMessage, isSubmitting, onCancel }: Props): ReactElement => (
    <div>
        <label className="block max-w-[300px] bg-black p-1">
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded border border-white bg-black p-3 font-display text-sm leading-3 text-white disabled:bg-gray-600"
            >
                Speichern
            </button>
        </label>
        <button type="button" onClick={onCancel} className="cursor-pointer text-sky-500 hover:text-sky-600">
            abbrechen
        </button>

        {isSubmitting && (
            <div>
                <span className="mr-1">Wird gespeichert</span>{' '}
                <span className="inline-block w-3 animate-spin">
                    <FontAwesomeIcon icon={faSpinner} />
                </span>
            </div>
        )}

        {errorMessage && <div className="text-red-600">{errorMessage}</div>}
    </div>
);

export default ApplicationDetailsFormControls;
