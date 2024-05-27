import { type ReactElement, useCallback, useState } from 'react';
import Image from 'next/image';

export default (): ReactElement | null => {
    const [show, setShow] = useState(true);

    const handleClick = useCallback(() => setShow(false), []);

    if (!show) {
        return null;
    }

    return (
        <div className="flex flex-col bg-gradient-to-r from-[#2c9fc9] to-[#e1017e] p-4 text-white lg:flex-row lg:space-x-4 lg:p-8 lg:text-xl">
            <div className="block w-20">
                <Image src="/assets/images/attention.svg" width="128" height="128" layout="responsive" alt="Achtung" />
            </div>
            <div className="flex w-full flex-col space-y-3 lg:flex-row lg:space-x-4 lg:space-y-0">
                <div className="w-full">
                    <span className="mb-[.5em] text-[1.25em] font-bold text-[#ffe596]">Hansaplatz am Sonntag verlegt!</span>
                    <p>Aufgrund der schlechten Wetterlage wurde der Programmort verlegt.</p>
                    <p className="text-[#ffe596]">Neuer Ort: B-Side, Am Hawerkamp 29, 48155 Münster</p>
                </div>
                <div className="lg:ml-auto">
                    <button className=" mt-4 whitespace-nowrap border border-white px-2  py-1" onClick={handleClick} type="button">
                        Alles klar!
                    </button>
                </div>
            </div>
        </div>
    );
};
