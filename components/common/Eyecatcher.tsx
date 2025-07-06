import type { PropsWithChildren, ReactElement } from 'react';

interface Props extends PropsWithChildren {
    stroke: string;
    fill: string;
}

const ArrowIcon = ({ children, stroke, fill }: Props): ReactElement => {
    return (
        <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-1/2">{children}</div>

            <svg
                width="100%"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                xlinkHref="http://www.w3.org/1999/xlink"
                version="1.1"
                viewBox="0 0 1469.9 1015.6"
            >
                <path
                    stroke={stroke}
                    strokeWidth={10}
                    fill={fill}
                    d="M1467.4,717.1h0l-152.4-18.1c-176.7-21-319.8,141.4-276.7,314.1h0l-124.4-121.5c-99.6-97.2-258.5-97.2-358.1,0l-124.4,121.5c43.1-172.7-100-335.1-276.7-314.1L2.5,717.1c174.5-85,174.5-333.6,0-418.6l152.4,18.1C331.6,337.6,474.7,175.2,431.6,2.5l124.4,121.5c99.6,97.2,258.5,97.2,358.1,0L1038.4,2.5h0c-43.1,172.7,100,335.1,276.7,314.1l152.4-18.1c-174.5,85-174.5,333.6,0,418.6"
                />
            </svg>
        </div>
    );
};

export default ArrowIcon;
