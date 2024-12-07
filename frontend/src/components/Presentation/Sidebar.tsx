import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faImage, faShapes, faPalette, faX, faFont } from '@fortawesome/free-solid-svg-icons';
import Icon from '@mdi/react';
import { mdiAnimation, mdiTransition } from '@mdi/js';
import { Button } from '../ui/button';
import CommonTooltip from '../Tooltip/CommonTooltip';
import { Grid3x3GapFill } from 'react-bootstrap-icons';

interface SidebarProps {
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarExpanded, setIsSidebarExpanded }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showTools, setShowTools] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    const handleToolsClick = () => {
        setShowTools((prev) => !prev);
    };

    return (
        <div className="relative bg-gray-300 md:bg-gray-50 dark:bg-zinc-900 dark:text-white flex lg:h-[669px] select-none">

            {/* Sidebar Icons List */}
            <div className='relative flex items-center justify-between md:gap-2 gap-1 h-18 md:h-full lg:w-20 lg:flex-col lg:justify-start lg:px-0 lg:pt-3 left-3 md:left-0'>

                {/* Palette Icon */}
                <div className="h-14 md:w-auto w-16 flex-1 lg:h-auto lg:flex-none">
                    <Button variant='ghost' className="group relative mx-auto flex h-full w-full flex-col items-center justify-center rounded duration-300 sm:px-6 lg:mx-0 lg:h-18 lg:w-18 lg:px-0">
                        <span className="pro-icon-wrapper">
                            <span className="pro-icon">
                                <FontAwesomeIcon icon={faPalette} fontSize="20px" className="menu-icon bell-icon" />
                            </span>
                        </span>
                        <span className="text-2xs leading-normal">Palette</span>
                    </Button>
                </div>

                {/* Texts Icon */}
                <div className="h-14 md:w-auto w-16 flex-1 lg:h-auto lg:flex-none">
                    <Button variant='ghost' className="group relative mx-auto flex h-full w-full flex-col items-center justify-center rounded duration-300 sm:px-6 lg:mx-0 lg:h-18 lg:w-18 lg:px-0">
                        <span className="pro-icon-wrapper">
                            <span className="pro-icon">
                                <FontAwesomeIcon icon={faFont} fontSize="20px" className="menu-icon bell-icon" />
                            </span>
                        </span>
                        <span className="text-2xs leading-normal">Texts</span>
                    </Button>
                </div>

                {/* Photos Icon */}
                <div className="h-14 md:w-auto w-16 flex-1 lg:h-auto lg:flex-none">
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
                <div className="h-14 md:w-auto w-16 flex-1 lg:h-auto lg:flex-none">
                    <Button variant='ghost' className="group relative mx-auto flex h-full w-full flex-col items-center justify-center rounded duration-300 sm:px-6 lg:mx-0 lg:h-18 lg:w-18 lg:px-0">
                        <span className="pro-icon-wrapper">
                            <span className="pro-icon">
                                <FontAwesomeIcon icon={faShapes} fontSize="20px" className="menu-icon bell-icon" />
                            </span>
                        </span>
                        <span className="text-2xs leading-normal">Shapes</span>
                    </Button>
                </div>

                <div>
                    {isMobile && (
                        <div>
                            {/* Grid Icon */}
                            <div className="h-14 w-16">
                                <Button variant='ghost' className="group h-full flex-col rounded duration-300" onClick={handleToolsClick}>
                                    <span className="pro-icon-wrapper">
                                        <span className="pro-icon">
                                            <Grid3x3GapFill size="22px" className="menu-icon bell-icon" />
                                        </span>
                                    </span>
                                    <span className="text-2xs leading-normal">Tools</span>
                                </Button>
                            </div>

                            {showTools && (
                                <div className={`bg-gray-200 dark:bg-zinc-800 flex items-center justify-between h-[400px] w-[360px] absolute bottom-18 -left-3 right-0 z-20 rounded-t-2xl`}>
                                    <div className="h-full w-full">
                                        {/* Close Button */}
                                        <div className="flex items-center justify-end h-12 px-4 w-full">
                                            <span className="flex mr-auto text-xl font-semibold">Tools</span>
                                            <FontAwesomeIcon icon={faX} fontSize={"20px"} onClick={handleToolsClick} />
                                        </div>
                                        <div className="flex absolute top-14 h-[351.8px] w-full px-3">
                                            {/* Transition Icon */}
                                            <div className="h-14">
                                                <Button variant='ghost' className="group h-full flex-col rounded duration-300">
                                                    <span className="pro-icon-wrapper">
                                                        <span className="pro-icon">
                                                            <Icon path={mdiTransition} size="22px" className="menu-icon bell-icon" />
                                                        </span>
                                                    </span>
                                                    <span className="text-2xs leading-normal">Transition</span>
                                                </Button>
                                            </div>

                                            {/* Animation Icon */}
                                            <div className="h-14">
                                                <Button variant='ghost' className="group h-full flex-col rounded duration-300">
                                                    <span className="pro-icon-wrapper">
                                                        <span className="pro-icon">
                                                            <Icon path={mdiAnimation} size="22px" className="menu-icon bell-icon" />
                                                        </span>
                                                    </span>
                                                    <span className="text-2xs leading-normal">Animation</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {!isMobile && (
                        <div>
                            <div className="h-14 md:w-auto w-18 flex-1 lg:h-auto lg:flex-none">
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
                            <div className="h-14 md:w-auto w-18 flex-1 lg:h-auto lg:flex-none">
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
                    )}
                </div>

            </div>

            {/* Sidebar Panel */}
            <div className={`hidden md:block h-full transition-all duration-500 ${isSidebarExpanded ? 'w-80 p-4 border-l border-black dark:border-slate-800' : 'w-0 p-0 pl-1 border-none'}`}>
                {/* Sidebar Close Button */}
                <Button className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-r-full transition-all duration-0 bg-gray-50 hover:bg-gray-50 text-black dark:bg-zinc-900 dark:hover:bg-zinc-900 h-20 z-10 dark:text-white"
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

        </div >
    );
}

export default Sidebar;
