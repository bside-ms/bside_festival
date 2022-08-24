/* eslint-disable react/jsx-props-no-spreading */
import type { ReactElement } from 'react';
import type { HeaderGroup, UseSortByColumnProps } from 'react-table';
import slimColumns from 'lib/volunteers/slimColumns';
import type VolunteerTableData from 'lib/volunteers/VolunteerTableData';

interface Props {
    column: HeaderGroup<VolunteerTableData> & UseSortByColumnProps<VolunteerTableData>;
}

const VolunteerOverviewTableHeaderCell = ({ column }: Props): ReactElement => {

    // @ts-expect-error | If it really will be a string someday it won't break anything
    if (slimColumns.includes(column.id)) {
        return (
            <th
                {...column.getHeaderProps(column.getSortByToggleProps)}
                scope="col"
                className="w-[50px] py-2 px-1 text-center"
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
                className="w-1/12 px-4 py-2 hidden md:table-cell"
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
                className="w-1/12 px-4 py-2"
            >
                {column.render('Header')}
            </th>
        );
    }

    if (column.id === 'additionalInformation') {
        return (
            <th
                {...column.getHeaderProps()}
                scope="col"
                className="px-4 py-2"
            >
                {column.render('Header')}
            </th>
        );
    }

    if (column.id === 'fullName') {
        return (
            <th
                {...column.getHeaderProps(column.getSortByToggleProps)}
                scope="col"
                className="px-4 py-2 text-left"
            >
                {column.render('Header')}
            </th>
        );
    }

    return (
        <th
            {...column.getHeaderProps()}
            scope="col"
            className="px-4 py-2 text-left"
        >
            {column.render('Header')}
        </th>
    );
};

export default VolunteerOverviewTableHeaderCell;
