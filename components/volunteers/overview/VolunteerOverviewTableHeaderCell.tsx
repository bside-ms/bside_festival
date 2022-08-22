/* eslint-disable react/jsx-props-no-spreading */
import type { ReactElement } from 'react';
import type { HeaderGroup } from 'react-table';
import slimColumns from 'lib/volunteers/slimColumns';
import type VolunteerTableData from 'lib/volunteers/VolunteerTableData';

interface Props {
    column: HeaderGroup<VolunteerTableData>;
}

const VolunteerOverviewTableHeaderCell = ({ column }: Props): ReactElement => {

    if (slimColumns.includes(column.id)) {
        return (
            <th
                {...column.getHeaderProps()}
                scope="col"
                className="font-medium text-gray-900 text-left py-2 px-1"
            >
                {column.render('Header')}
            </th>
        );
    }

    if (column.id === 'preferredMessengers') {
        return (
            <th
                {...column.getHeaderProps()}
                scope="col"
                className="font-medium text-gray-900 px-4 py-2 text-left w-1/12 hidden md:table-cell"
            >
                {column.render('Header')}
            </th>
        );
    }

    if (column.id === 'phoneNumber') {
        return (
            <th
                {...column.getHeaderProps()}
                scope="col"
                className="font-medium text-gray-900 px-4 py-2 text-left w-1/12"
            >
                {column.render('Header')} <span className="font-bold text-red-700">*</span>
            </th>
        );
    }

    if (column.id === 'additionalInformation') {
        return (
            <th
                {...column.getHeaderProps()}
                scope="col"
                className="font-medium text-gray-900 px-4 py-2 text-left w-2/12"
            >
                {column.render('Header')}
            </th>
        );
    }

    return (
        <th
            {...column.getHeaderProps()}
            scope="col"
            className="font-medium text-gray-900 px-4 py-2 text-left"
        >
            {column.render('Header')}
        </th>
    );
};

export default VolunteerOverviewTableHeaderCell;
