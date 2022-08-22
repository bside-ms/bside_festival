/* eslint-disable react/jsx-props-no-spreading */
import { useCallback } from 'react';
import { truncate } from 'lodash';
import type { ReactElement } from 'react';
import type { Cell } from 'react-table';
import { useVolunteersOverviewTableContext } from 'components/volunteers/overview/VolunteersOverviewTableContext';
import slimColumns from 'lib/volunteers/slimColumns';
import type VolunteerTableData from 'lib/volunteers/VolunteerTableData';

interface Props {
    volunteer: VolunteerTableData;
    cell: Cell<VolunteerTableData>;
}

const VolunteerOverviewTableCell = ({ cell: { column, getCellProps, render }, volunteer }: Props): ReactElement => {

    const { toggleTruncatedRow, notTruncatedRows } = useVolunteersOverviewTableContext();

    const handleCellClick = useCallback(() => {
        toggleTruncatedRow(volunteer.id);
    }, [toggleTruncatedRow, volunteer.id]);

    if (column.id === 'additionalInformation') {
        if (notTruncatedRows.includes(volunteer.id)) {
            return (
                <td
                    {...getCellProps()}
                    className="text-gray-900 px-4 py-2 max-w-[300px] hover:bg-gray-50 cursor-pointer"
                    onClick={handleCellClick}
                >
                    {volunteer.additionalInformation}
                </td>
            );
        }

        return (
            <>
                <td
                    {...getCellProps()}
                    className="text-gray-900 px-4 py-2 max-w-[300px] hover:bg-gray-50 cursor-pointer hidden lg:table-cell"
                    onClick={handleCellClick}
                >
                    {truncate(volunteer.additionalInformation, { length: 35 })}
                </td>
                <td
                    {...getCellProps()}
                    className="text-gray-900 px-4 py-2 max-w-[300px] hover:bg-gray-50 cursor-pointer lg:hidden"
                    onClick={handleCellClick}
                >
                    {truncate(volunteer.additionalInformation, { length: 15 })}
                </td>
            </>
        );
    }

    if (column.id === 'fullName') {
        return (
            <td
                {...getCellProps()}
                className="text-gray-900 px-4 py-2 whitespace-nowrap sticky left-0 bg-gray-200"
            >
                {render('Cell')}
            </td>
        );
    }

    if (slimColumns.includes(column.id)) {
        return (
            <td
                {...getCellProps()}
                className="text-gray-900 px-1 py-2"
            >
                {render('Cell')}
            </td>
        );
    }

    if (column.id === 'preferredMessengers') {
        return (
            <td
                {...getCellProps()}
                className="text-gray-900 px-4 py-2 hidden md:block"
            >
                {render('Cell')}
            </td>
        );
    }

    return (
        <td
            {...getCellProps()}
            className="text-gray-900 px-4 py-2"
        >
            {render('Cell')}
        </td>
    );
};

export default VolunteerOverviewTableCell;
