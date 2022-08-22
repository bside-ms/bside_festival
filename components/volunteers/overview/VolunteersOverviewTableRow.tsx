/* eslint-disable react/jsx-props-no-spreading */
import type { ReactElement } from 'react';
import type { Row } from 'react-table';
import VolunteerOverviewTableCell from 'components/volunteers/overview/VolunteerOverviewTableCell';
import type VolunteerTableData from 'lib/volunteers/VolunteerTableData';

interface Props {
    row: Row<VolunteerTableData>;
    prepareRow: (row: Row<VolunteerTableData>) => void;
}

const VolunteersOverviewTableRow = ({ row, prepareRow }: Props): ReactElement => {

    prepareRow(row);

    return (
        <tr {...row.getRowProps()} className="border-b align-top">
            {row.cells.map(cell => (
                <VolunteerOverviewTableCell
                    key={cell.column.id}
                    cell={cell}
                    volunteer={row.original}
                />
            ))}
        </tr>
    );
};

export default VolunteersOverviewTableRow;
