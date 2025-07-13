'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import formatDate from '@/lib/common/helper/formatDate';
import { cn } from '@/lib/utils';

function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
    const values = React.useMemo(
        () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
        [value, defaultValue, min, max],
    );

    return (
        <SliderPrimitive.Root
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            className={cn(
                'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
                className,
            )}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot="slider-track"
                className={cn(
                    'relative grow overflow-hidden rounded-full border-none bg-muted ring-0 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
                )}
            >
                <SliderPrimitive.Range
                    data-slot="slider-range"
                    className={cn('absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full')}
                />
            </SliderPrimitive.Track>
            {values.map((value, index) => (
                <SliderPrimitive.Thumb
                    data-slot="slider-thumb"
                    key={index}
                    className="block cursor-pointer rounded-2xl border-none bg-white px-3 py-1 font-mono text-sm whitespace-nowrap ring-0 select-none"
                >
                    {formatDate(new Date(value), 'EEEEEE HH:mm')}
                </SliderPrimitive.Thumb>
            ))}
        </SliderPrimitive.Root>
    );
}

export { Slider };
