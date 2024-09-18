import React, { useState } from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="relative inline-block h-0 w-0 md:mt-1.5 mt-0.5"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div>
                {children}
            </div>
            {isHovered && (
                <div className="absolute md:left-7 -left-24 md:-translate-y-12 -translate-y-24 md:mt-0 -mt-1 w-52 bg-black text-white text-sm rounded p-2">
                    {text}
                    <div className="sm:hidden">
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black ml-0.5"></div>
                    </div>
                    <div className="hidden sm:inline-flex">
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-black"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
