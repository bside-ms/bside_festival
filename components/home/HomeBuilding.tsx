import buildingPhoto from '@/images/2026/home/building-locations.png';
import Image from 'next/image';
import type { ReactElement } from 'react';

const HomeBuilding = (): ReactElement => {
    return (
        <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-square overflow-hidden">
                <Image src={buildingPhoto} alt="" fill className="object-contain drop-shadow-xl" sizes="(max-width: 1024px) 100vw, 36rem" />
            </div>
            <span className="sr-only">Zeichnung des B-Side Gebäudes mit drei Etagen</span>
        </div>
    );
};

export default HomeBuilding;
