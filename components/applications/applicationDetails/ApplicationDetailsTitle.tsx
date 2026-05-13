import ApplicationDetailsEditButton from '@/components/applications/applicationDetails/ApplicationDetailsEditButton';
import type { ReactElement } from 'react';

interface Props {
    children: string;
    onEditClick?: () => void;
}

const ApplicationDetailsTitle = ({ children, onEditClick }: Props): ReactElement => (
    <div className="font-display">
        {children}
        {onEditClick && <ApplicationDetailsEditButton onClick={onEditClick} />}
    </div>
);

export default ApplicationDetailsTitle;
