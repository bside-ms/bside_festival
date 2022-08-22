import { useMemo } from 'react';
import type { ReactElement } from 'react';
import type { Column } from 'react-table';
import { useTable } from 'react-table';
import VolunteerOverviewTableHeaderCell from 'components/volunteers/overview/VolunteerOverviewTableHeaderCell';
import VolunteersOverviewTableRow from 'components/volunteers/overview/VolunteersOverviewTableRow';
import useVolunteersTableData from 'lib/volunteers/useVolunteersTableData';
import type Volunteer from 'lib/volunteers/Volunteer';
import type VolunteerTableData from 'lib/volunteers/VolunteerTableData';

interface Props {
    allVolunteers: Array<Volunteer>;
}

const VolunteersOverviewTable = ({ allVolunteers }: Props): ReactElement => {

    const volunteerTableData = useVolunteersTableData(allVolunteers);

    const columns = useMemo<Array<Column<VolunteerTableData>>>(() => ([
        { Header: 'Name', accessor: 'fullName' },
        { Header: 'Telefon', accessor: 'phoneNumber' },
        { Header: 'Messenger', accessor: 'preferredMessengers' },
        { Header: '💪', accessor: 'muscles' },
        { Header: '🚗', accessor: 'car' },
        { Header: '👥', accessor: 'social' },
        { Header: '🧑‍🔧', accessor: 'technician' },
        { Header: '🧑‍🍳', accessor: 'cook' },
        { Header: '🧑‍🎨', accessor: 'artist' },
        { Header: '🧒', accessor: 'kids' },
        { Header: '🧹', accessor: 'cleanup' },
        { Header: '🌟', accessor: 'multi' },
        { Header: 'Fr', accessor: 'isFridayChecked' },
        { Header: 'Sa', accessor: 'isSaturdayChecked' },
        { Header: 'So', accessor: 'isSundayChecked' },
        { Header: 'Infos', accessor: 'additionalInformation' },
    ]), []);

    const tableInstance = useTable<VolunteerTableData>({ columns, data: volunteerTableData });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    /* eslint-disable react/jsx-props-no-spreading,react/jsx-key */
    return (
        <div className="overflow-auto max-h-screen bg-white">
            <table {...getTableProps()} className="min-w-full table-fixed">
                <thead className="border-b border-gray-400 sticky top-0 bg-gray-300 z-50">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <VolunteerOverviewTableHeaderCell
                                    key={column.id}
                                    column={column}
                                />
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {rows.map(row => (
                        <VolunteersOverviewTableRow
                            key={row.id}
                            row={row}
                            prepareRow={prepareRow}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
    /* eslint-enable react/jsx-props-no-spreading,react/jsx-key */
};

export default VolunteersOverviewTable;
