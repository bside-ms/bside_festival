import formatDate from '@/lib/common/helper/formatDate';
import { datenExportColumnLabels, type DatenExportColumnId } from '@/lib/datenExport/columns';
import { zipWith } from 'lodash';

const csvNeedsQuotes = (value: string): boolean =>
    value.includes(';') ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r') ||
    value.startsWith(' ') ||
    value.endsWith(' ');

const escapeCsvCell = (value: string): string => {
    if (!csvNeedsQuotes(value)) {
        return value;
    }

    return `"${value.replaceAll('"', '""')}"`;
};

const toExcelTextFormula = (value: string): string => `="${value.replaceAll('"', '""')}"`;

const toCsvCell = (columnId: DatenExportColumnId, value: string): string => {
    if (columnId === 'contactPhone' && value.length > 0) {
        return toExcelTextFormula(value);
    }

    return value;
};

export const buildDatenExportCsv = (columnIds: Array<DatenExportColumnId>, rows: Array<Array<string>>): string => {
    const headers = columnIds.map((columnId) => datenExportColumnLabels[columnId]);
    const csvRows = rows.map((row) =>
        zipWith(columnIds, row, (columnId, cell) => (columnId === undefined ? (cell ?? '') : toCsvCell(columnId, cell ?? ''))),
    );
    const lines = [headers, ...csvRows].map((line) => line.map(escapeCsvCell).join(';'));

    return `\uFEFF${lines.join('\r\n')}\r\n`;
};

export const datenExportFilename = (): string => `datenexport-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
