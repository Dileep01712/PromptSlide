import React, { useState } from 'react';

interface CommonTooltipProps {
    text: string;
    children: React.ReactNode;
    width?: number | string;
    negativeLeft?: number;
    positiveLeft?: number;
    negativeX?: number;
    positiveX?: number;
    negativeY?: number;
    positiveY?: number;
}

const CommonTooltip: React.FC<CommonTooltipProps> = ({
    text,
    children,
    width,
    negativeLeft,
    positiveLeft,
    negativeX,
    positiveX,
    negativeY,
    positiveY
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const tooltipStyles = {
        left: positiveLeft !== undefined ? `${positiveLeft}px` : negativeLeft !== undefined ? `-${negativeLeft}px` : 'auto',
        transform: `translate(${positiveX !== undefined ? positiveX : -negativeX || 0}px, ${positiveY !== undefined ? positiveY : -negativeY || 0}px)`,
        width: typeof width === 'number' ? `${width}px` : width || 'auto',
        minWidth: '100%' // Prevents the tooltip from overflowing
    };

    return (
        <div className="relative flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div>
                {children}
            </div>
            {isHovered && (
                <div className="absolute bg-zinc-950 dark:bg-zinc-700 text-white text-xs text-center rounded p-2 inline-block" style={tooltipStyles}>
                    {text}
                </div>
            )}
        </div>
    );
};

export default CommonTooltip;
