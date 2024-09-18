import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faImage, faShapes, faPalette } from '@fortawesome/free-solid-svg-icons';
import Icon from '@mdi/react';
import { mdiAnimation, mdiTransition } from '@mdi/js';
import { Button } from '../ui/button';
import CommonTooltip from '../Tooltip/CommonTooltip';

interface SidebarProps {
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarExpanded, setIsSidebarExpanded }) => {

    return (
        <div className="relative bg-gray-50 dark:bg-zinc-950 dark:text-white flex shrink-0 lg:h-[669px]">

            {/* Sidebar Icons List */}
            <div className='relative flex items-center justify-between gap-2 h-full lg:w-20 lg:flex-col lg:justify-start lg:px-0 lg:pt-3'>

                {/* Palette Icon */}
                <div className="h-14 flex-1 lg:h-auto lg:flex-none">
                    <Button variant='ghost' className="group relative mx-auto flex h-full w-full flex-col items-center justify-center rounded duration-300 sm:px-6 lg:mx-0 lg:h-18 lg:w-18 lg:px-0">
                        <span className="pro-icon-wrapper">
                            <span className="pro-icon">
                                <FontAwesomeIcon icon={faPalette} fontSize="20px" className="menu-icon bell-icon" />
                            </span>
                        </span>
                        <span className="text-2xs leading-normal">Palette</span>
                    </Button>
                </div>
                
                {/* Fonts Icon */}
                <div className="h-14 flex-1 lg:h-auto lg:flex-none">
                    <Button variant='ghost' className="group relative mx-auto flex h-full w-full flex-col items-center justify-center rounded duration-300 sm:px-6 lg:mx-0 lg:h-18 lg:w-18 lg:px-0">
                        <span className="pro-icon-wrapper">
                            <span className="pro-icon">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="menu-icon bell-icon" height="2em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z">
                                    </path>
                                </svg>
                            </span>
                        </span>
                        <span className="text-2xs leading-normal">Texts</span>
                    </Button>
                </div>

                {/* Image Icon */}
                <div className="h-14 flex-1 lg:h-auto lg:flex-none">
                    <Button variant='ghost' className="group relative mx-auto flex h-full w-full flex-col items-center justify-center rounded duration-300 sm:px-6 lg:mx-0 lg:h-18 lg:w-18 lg:px-0">
                        <span className="pro-icon-wrapper">
                            <span className="pro-icon">
                                <FontAwesomeIcon icon={faImage} fontSize="20px" className="menu-icon bell-icon" />
                            </span>
                        </span>
                        <span className="text-2xs leading-normal">Photos</span>
                    </Button>
                </div>

                {/* Shapes Icon */}
                <div className="h-14 flex-1 lg:h-auto lg:flex-none">
                    <Button variant='ghost' className="group relative mx-auto flex h-full w-full flex-col items-center justify-center rounded duration-300 sm:px-6 lg:mx-0 lg:h-18 lg:w-18 lg:px-0">
                        <span className="pro-icon-wrapper">
                            <span className="pro-icon">
                                <FontAwesomeIcon icon={faShapes} fontSize="20px" className="menu-icon bell-icon" />
                            </span>
                        </span>
                        <span className="text-2xs leading-normal">Shapes</span>
                    </Button>
                </div>

                {/* Transition Icon */}
                <div className="h-14 flex-1 lg:h-auto lg:flex-none">
                    <Button variant='ghost' className="group relative mx-auto flex h-full w-full flex-col items-center justify-center rounded duration-300 sm:px-6 lg:mx-0 lg:h-18 lg:w-18 lg:px-0">
                        <span className="pro-icon-wrapper">
                            <span className="pro-icon">
                                <Icon path={mdiTransition} size="26px" className="menu-icon bell-icon" />
                            </span>
                        </span>
                        <span className="text-2xs leading-normal">Transition</span>
                    </Button>
                </div>

                {/* Animation Icon */}
                <div className="h-14 flex-1 lg:h-auto lg:flex-none">
                    <Button variant='ghost' className="group relative mx-auto flex h-full w-full flex-col items-center justify-center rounded duration-300 sm:px-6 lg:mx-0 lg:h-18 lg:w-18 lg:px-0">
                        <span className="pro-icon-wrapper">
                            <span className="pro-icon">
                                <Icon path={mdiAnimation} size="26px" className="menu-icon bell-icon" />
                            </span>
                        </span>
                        <span className="text-2xs leading-normal">Animation</span>
                    </Button>
                </div>

            </div>

            {/* Sidebar Panel */}
            <div className={`h-full transition-all duration-300 ${isSidebarExpanded ? 'w-80 p-4 border-l border-black dark:border-slate-800' : 'w-0 p-0 pl-1 border-none'}`}>
                {/* Sidebar Close Button */}
                <Button className="absolute -right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-r-full transition-all duration-0 bg-gray-50 hover:bg-gray-50 text-black dark:bg-zinc-950 dark:hover:bg-zinc-950 h-20 z-10 dark:text-white"
                    onClick={() => setIsSidebarExpanded((prevState) => !prevState)}>
                    {isSidebarExpanded ? (
                        <CommonTooltip text="Close" positiveLeft={25}>
                            <FontAwesomeIcon icon={faChevronLeft} fontSize="20px" />
                        </CommonTooltip>
                    ) : (
                        <CommonTooltip text="Open" positiveLeft={25}>
                            <FontAwesomeIcon icon={faChevronRight} fontSize="20px" />
                        </CommonTooltip>
                    )}
                </Button>
            </div>
            
        </div>
    );
}

export default Sidebar;
