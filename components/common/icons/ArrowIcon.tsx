import type { ReactElement } from 'react';

interface Props {
    size: number;
    color: string;
}

const ArrowIcon = ({ size, color }: Props): ReactElement => {
    return (
        <svg
            height={size}
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            xlinkHref="http://www.w3.org/1999/xlink"
            version="1.1"
            viewBox="0 0 201 213.6"
        >
            <path
                fill={color}
                d="M201,114.9l-9.6-9.3-63.6,63.9c-9.9,9.9-20.7,4.2-20.7-9.3L107.4,0h-13.8l.3,160.2c0,13.5-11.1,19.2-21,9.3L9.6,105.6,0,114.9l98.1,98.7h4.8l98.1-98.7Z"
            />
        </svg>
    );
};

export default ArrowIcon;
