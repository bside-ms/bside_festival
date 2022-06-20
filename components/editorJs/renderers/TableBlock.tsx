import type { ReactElement } from 'react';
import TextWithHtml from 'components/editorJs/renderers/TextWithHtml';
import { TableBlock } from 'lib/editorJs/Block';

const TableHeaderRow = ({ headerColumns }: { headerColumns: Array<string> }): ReactElement => {

    return (
        <thead>
            <tr>
                {headerColumns.map(header => (
                    <th key={header} className="px-2 py-1 border-2 bg-gray-200 text-left">
                        <TextWithHtml text={header} />
                    </th>
                ))}
            </tr>
        </thead>
    );
};

const TableDataRow = ({ dataColumns }: { dataColumns: Array<string> }): ReactElement => {

    return (
        <tr>
            {dataColumns.map(data => (
                <td key={data} className="px-2 py-1 border-2 border-gray-200">
                    <TextWithHtml text={data} />
                </td>
            ))}
        </tr>
    );
};

const TableBody = ({ data }: { data: Array<Array<string>> }): ReactElement => {

    return (
        <tbody>
            {data.map((dataRow, index) => (
                <TableDataRow
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    dataColumns={dataRow}
                />
            ))}
        </tbody>
    );
};

interface Props {
    data: TableBlock['data'];
}

const TableBlock = ({ data: { withHeadings, content } }: Props): ReactElement => {

    if (withHeadings) {
        const [headerRow, ...dataRows] = content;

        if (headerRow === undefined) {
            return (
                <table>
                    <TableBody data={content} />
                </table>
            );
        }

        return (
            <table>
                <TableHeaderRow headerColumns={headerRow} />

                <TableBody data={dataRows} />
            </table>
        );
    }

    return (
        <table>
            <TableBody data={content} />
        </table>
    );
};

export default TableBlock;
