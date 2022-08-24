import { useMemo } from 'react';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import type { Column, StringKey, UseSortByColumnProps } from 'react-table';
import { useSortBy, useTable } from 'react-table';
import VolunteerOverviewTableFooterCell from 'components/volunteers/overview/VolunteerOverviewTableFooterCell';
import VolunteerOverviewTableHeaderCell from 'components/volunteers/overview/VolunteerOverviewTableHeaderCell';
import VolunteersOverviewTableRow from 'components/volunteers/overview/VolunteersOverviewTableRow';
import useVolunteersTableData from 'lib/volunteers/useVolunteersTableData';
import type Volunteer from 'lib/volunteers/Volunteer';
import type VolunteerTableData from 'lib/volunteers/VolunteerTableData';

interface Props {
    allVolunteers: Array<Volunteer>;
}

const getColumnProps = (label: string, accessor: StringKey<VolunteerTableData>): Column<VolunteerTableData> => ({
    Header: (props): ReactElement => {

        const sortByColumnProps = props.column as unknown as UseSortByColumnProps<VolunteerTableData>;

        if (sortByColumnProps.isSorted) {
            const sortIcon = sortByColumnProps.isSortedDesc === true ? faCaretDown : faCaretUp;

            return (
                <div>
                    {label} <FontAwesomeIcon icon={sortIcon} />
                </div>
            );
        }

        return <div>{label}</div>;
    },
    accessor,
    Footer: label,
});

const getSensitiveColumnProps = (label: string, accessor: StringKey<VolunteerTableData>): Column<VolunteerTableData> => ({
    Header: () => <div>{label} <span className="font-bold text-red-700">*</span></div>,
    accessor,
    Footer: () => <div>{label} <span className="font-bold text-red-700">*</span></div>,
});

const getCheckboxColumnProps = (label: string, accessor: StringKey<VolunteerTableData>): Column<VolunteerTableData> => ({
    Header: (props): ReactElement => {

        const sortByColumnProps = props.column as unknown as UseSortByColumnProps<VolunteerTableData>;

        // TODO: title

        if (sortByColumnProps.isSorted) {
            const sortIcon = sortByColumnProps.isSortedDesc === true ? faCaretDown : faCaretUp;

            return (
                <div>
                    {label} <FontAwesomeIcon icon={sortIcon} />
                </div>
            );
        }

        return <div>{label}</div>;
    },
    accessor,
    Footer: (props): ReactElement => {

        const checkedRows = props.rows.filter(row => {
            return row.original[accessor] === '✅';
        });

        return (
            <div>
                {label}<br />
                <span className="font-bold">{checkedRows.length}</span>
            </div>
        );
    },
});

const VolunteersOverviewTable = ({ allVolunteers }: Props): ReactElement => {

    const volunteerTableData = useVolunteersTableData(allVolunteers);

    const columns = useMemo<Array<Column<VolunteerTableData>>>(() => ([
        getColumnProps('Name', 'fullName'),
        getSensitiveColumnProps('Telefon', 'phoneNumber'),
        getColumnProps('Messenger', 'preferredMessengers'),
        getCheckboxColumnProps('💪', 'muscles'),
        getCheckboxColumnProps('🚗', 'car'),
        getCheckboxColumnProps('👥', 'social'),
        getCheckboxColumnProps('🧑‍🔧', 'technician'),
        getCheckboxColumnProps('🧑‍🍳', 'cook'),
        getCheckboxColumnProps('🧑‍🎨', 'artist'),
        getCheckboxColumnProps('🧒', 'kids'),
        getCheckboxColumnProps('🧹', 'cleanup'),
        getCheckboxColumnProps('🌟', 'multi'),
        getCheckboxColumnProps('Fr', 'isFridayChecked'),
        getCheckboxColumnProps('Sa', 'isSaturdayChecked'),
        getCheckboxColumnProps('So', 'isSundayChecked'),
        getColumnProps('Infos', 'additionalInformation'),
    ]), []);

    const tableInstance = useTable<VolunteerTableData>(
        { columns, data: volunteerTableData },
        useSortBy
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        footerGroups,
        prepareRow,
    } = tableInstance;

    /* eslint-disable react/jsx-props-no-spreading,react/jsx-key */
    return (
        <div className="overflow-auto bg-white">
            <table {...getTableProps()} className="min-w-full table-fixed text-gray-900 text-left">
                <thead className="bg-gray-300">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <VolunteerOverviewTableHeaderCell
                                    key={column.id}
                                    // @ts-expect-error | Don't know yet how to fix this, but it's fine
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

                <tfoot className="bg-gray-300">
                    {footerGroups.map(footerGroup => (
                        <tr {...footerGroup.getFooterGroupProps()} className="font-bold">
                            {footerGroup.headers.map(column => (
                                <VolunteerOverviewTableFooterCell
                                    key={column.id}
                                    column={column}
                                />
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
        </div>
    );
    /* eslint-enable react/jsx-props-no-spreading,react/jsx-key */
};

export default VolunteersOverviewTable;
