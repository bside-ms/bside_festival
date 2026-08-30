'use client';

import type { ReactElement } from 'react';

const printWorkshopAttendees = (): void => window.print();

const WorkshopAttendeePrintButton = (): ReactElement => (
    <button
        type="button"
        onClick={printWorkshopAttendees}
        className="bg-[#2C2E83] px-5 py-3 font-display font-black text-white print:hidden"
    >
        Liste drucken
    </button>
);

export default WorkshopAttendeePrintButton;
