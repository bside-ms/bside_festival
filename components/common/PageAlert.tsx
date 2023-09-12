import { type ReactElement, useCallback, useState } from 'react';
import Image from 'next/image';

export default (): ReactElement | null => {
    const [show, setShow] = useState(true);

    const handleClick = useCallback(() => setShow(false), []);

    if (!show) {
        return null;
    }

    return (
        <div className="flex flex-col lg:flex-row bg-gradient-to-r from-[#2c9fc9] to-[#e1017e] p-4 text-white lg:p-8 lg:text-x lg:space-x-4">
            <div className="block w-20">
                <Image src="/assets/images/attention.svg" width="128" height="128" layout="responsive" alt="Achtung" />
            </div>
            <div className="flex flex-col space-y-3 lg:space-y-0 lg:space-x-4 lg:flex-row w-full">
                <div className="w-full">
                    <span className="text-[#ffe596] text-[1.25em] mb-[.5em] font-bold">Hansaplatz am Sonntag verlegt!</span>
                    <p>Aufgrund der schlechten Wetterlage wurde der Programmort verlegt.</p>
                    <p className="text-[#ffe596]">Neuer Ort: B-Side, Am Hawerkamp 29, 48155 Münster</p>
                </div>
                <div className="lg:ml-auto">
                    <button className=" whitespace-nowrap border border-white px-2 py-1  mt-4" onClick={handleClick} type="button">
                        Alles klar!
                    </button>
                </div>
            </div>
        </div>
    );
};
