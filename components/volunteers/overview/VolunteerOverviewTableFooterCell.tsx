/* eslint-disable react/jsx-props-no-spreading */
import type { ReactElement } from 'react';
import type { HeaderGroup } from 'react-table';
import slimColumns from 'lib/volunteers/slimColumns';
import type VolunteerTableData from 'lib/volunteers/VolunteerTableData';

interface Props {
    column: HeaderGroup<VolunteerTableData>;
}

const VolunteerOverviewTableFooterCell = ({ column }: Props): ReactElement => {

    // @ts-expect-error | If it really will be a string someday it won't break anything
    if (slimColumns.includes(column.id)) {
        return (
            <th
                {...column.getFooterProps()}
                className="px-4 py-2 text-center"
            >
                {column.render('Footer')}
            </th>
        );
    }

    return (
        <td
            {...column.getFooterProps()}
            className="px-4 py-2"
        >
            {column.render('Footer')}
        </td>
    );
};

export default VolunteerOverviewTableFooterCell;
