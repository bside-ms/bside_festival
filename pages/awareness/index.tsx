import Image from 'next/image';
import type { ReactElement } from 'react';
import AwarenessInformation from 'components/awareness/AwarenessInformation';
import Footer from 'components/common/Footer';

export default (): ReactElement => {
    return (
        <div>
            <div className="min-h-screen w-full relative ">
                <div className="relative z-10">
                    <div className="p-5 md:p-10 w-full md:w-2/3 max-w-[700px] mx-auto drop-shadow-xl">
                        <AwarenessInformation />
                    </div>
                </div>

                <Image src="/assets/background.webp" alt="Hintergrund" className="object-cover object-top absolute z-0" fill={true} />
            </div>

            <Footer />
        </div>
    );
};
