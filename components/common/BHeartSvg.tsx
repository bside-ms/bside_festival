import type { ReactElement } from 'react';

interface Props {
    size: number;
    color: string;
}

const BHeartSvg = ({ size, color }: Props): ReactElement => {
    return (
        <svg height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 255.12 232.07" version="1.1">
            <path
                stroke={color}
                fill="transparent"
                strokeWidth={20}
                d="m53.921 28.06 44.62 36.222 72.234-52.141 76.948 53.603v69.359l-119.548 89.176L7.45 135.428v-69.36Z"
            />
        </svg>
    );
};

export default BHeartSvg;
