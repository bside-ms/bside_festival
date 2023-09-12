import type { ReactElement } from 'react';
import BHeartSvg from 'components/common/BHeartSvg';

const BHeartGrid = (): ReactElement => {
    return (
        <div className="grid grid-cols-9 gap-y-3">
            {new Array(2).fill('').map((_outerItem, outerIndex) => {
                const innerIndexCheck = outerIndex % 2 === 0 ? 0 : 1;

                return new Array(9).fill('').map((_innerItem, innerIndex) => {
                    const key = `${outerIndex}_${innerIndex}`;

                    if (innerIndex % 2 === innerIndexCheck) {
                        return <BHeartSvg key={key} size={30} color="#584a9a" />;
                    } else {
                        return <div key={key} />;
                    }
                });
            })}
        </div>
    );
};

export default BHeartGrid;
