import { range } from 'lodash';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import ProgramItemPlaceholder from 'components/program/program/ProgramItemPlaceholder';

const ProgramItemPlaceholders = (): ReactElement => {

    return (
        <ContentWrapper>
            <div className="space-y-5 py-5">
                {range(150).map(placeholderId => (
                    <ProgramItemPlaceholder key={placeholderId} />
                ))}
            </div>
        </ContentWrapper>
    );
};

export default ProgramItemPlaceholders;
