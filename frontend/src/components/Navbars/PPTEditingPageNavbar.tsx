import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { useNavigation } from '../Navigation/Navigate';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faDesktop, faDownload } from "@fortawesome/free-solid-svg-icons";
import { MoonStarsFill, BrightnessHigh, PersonCircle, CloudArrowUp, CloudCheck } from 'react-bootstrap-icons';
import Icon from '@mdi/react';
import { mdiArrowLeftTop, mdiArrowRightTop } from '@mdi/js';
import CommonTooltip from '../Tooltip/CommonTooltip';

interface PPTEditingPageNavbarProps {
    isDarkMode: boolean;
    toggleIcon: () => void;
}

const PPTEditingPageNavbar: React.FC<PPTEditingPageNavbarProps> = ({isDarkMode, toggleIcon}) => {
    const { handleButtonClick } = useNavigation();
    const [isLargeScreen] = useState(window.innerWidth >= 1024);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showButtons, setShowButtons] = useState(false);
    const [isScrolled] = useState(false);

    const handleToggleButtons = () => {
        if (isScrolled) {
            setShowButtons(false);
        } else {
            setShowButtons(!showButtons);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowButtons(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center justify-center lg:p-2.5 px-3.5 py-2.5 lg:pl-14 border-b sticky top-0 dark:bg-zinc-950/60">

            {/* Navbar Logo */}
            <div className="flex items-center select-none w-fit" onClick={() => handleButtonClick('/')}>
                <div className='flex justify-center items-center cursor-pointer w-10 lg:w-fit'>
                    <img src="./src/assets/Navbar/logo.webp" alt="Logo" className="lg:h-10 rounded-3xl border border-black" />
                </div>
                <div className='inline-block pl-2 cursor-pointer'>
                    <span className="font-Varino font-bold lg:text-2xl text-black dark:text-white">
                        PROMPTSLIDE
                    </span>
                </div>
            </div>

            {/* Backup & Undo/Redo  Icons */}
            <div className="flex items-center justify-center w-fit mx-auto">

                <CommonTooltip text='Undo' positiveY={46}>
                    <div className='hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer'>
                        <Icon path={mdiArrowLeftTop} size="27px" />
                    </div>
                </CommonTooltip>

                <CommonTooltip text='Redo' positiveY={46}>
                    <div className='hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer mx-2'>
                        <Icon path={mdiArrowRightTop} size="27px" />
                    </div>
                </CommonTooltip>


                {isDarkMode ? (
                    <CommonTooltip text='All your changes saved' width={140} positiveY={46} negativeLeft={45}>
                        <div className='hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer mx-2'>
                            <CloudCheck size="27px" />
                        </div>
                    </CommonTooltip>
                ) : (
                    <div className='flex items-center justify-center'>
                        <div className='hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer mx-2'>
                            <CloudArrowUp size="27px" />
                        </div>
                        <span className='text-sm'>Saving..</span>
                    </div>
                )}

            </div>

            {/* Center */}
            <div className="flex items-center justify-center w-96 h-9 mx-auto">
                <div>
                    <input type="text" className="md:h-8 h-8 hover:border hover:border-gray-300 outline-none rounded w-full text-ellipsis bg-transparent px-3 font-Degular text-lg" placeholder='Updated Button Component with Improvements' />
                </div>
            </div>

            {/* Right Side */}
            <div className="w-fit md:flex">

                {isLargeScreen ? (

                    // Large Screen Buttons
                    <div className='flex items-center justify-center w-full'>

                        {/* Present & Download Buttons */}
                        <div>
                            <Button variant='outline' className="font-Degular text-md mx-2 h-9">
                                <FontAwesomeIcon icon={faDesktop} className='mr-3' />
                                Present
                            </Button>
                            <Button variant='outline' className="font-Degular text-md h-9 mr-2">
                                <FontAwesomeIcon icon={faDownload} className='mr-3' />
                                Export
                            </Button>
                        </div>

                        <div className="border-l border-black dark:border-white h-9 mr-2"></div>

                        {/* Mode Button */}
                        <div className="hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer" onClick={toggleIcon}>
                            {isDarkMode ? (
                                <BrightnessHigh size={"28px"} />
                            ) : (
                                <MoonStarsFill size={"28px"} />
                            )}
                        </div>

                        <div className="border-l border-black dark:border-white h-9 ml-2"></div>

                        {/* User Login/Signup Buttons */}
                        <div>
                            {isDarkMode ? (
                                <div className="ml-2 mr-2 hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-full p-1 cursor-pointer">
                                    <PersonCircle size="32px" />
                                </div>
                            ) : (
                                <div>
                                        <Button className="mx-2 font-Degular text-md h-9" onClick={() => handleButtonClick('/login')}>Log In</Button>
                                        <Button className="mr-4 font-Degular text-md h-9" onClick={() => handleButtonClick('/signup')}>Sign Up</Button>
                                </div>
                            )}
                        </div>
                    </div>

                ) : (

                    // Small Screen Buttons
                    <div className="relative" ref={dropdownRef}>
                        <FontAwesomeIcon icon={faBars} fontSize={"20px"} onClick={handleToggleButtons} />
                        {showButtons && (
                            <div className="absolute top-11 transform -translate-x-full z-50 rounded-lg shadow-xl p-5 w-min transition-all duration-300 bg-blue-200 h-52 flex flex-col items-center justify-center">
                                <div className="grow w-64 flex flex-col items-center">
                                    <Button className="font-Degular text-md my-2">Log in</Button>
                                    <Button className="font-Degular text-md my-auto">Sign Up</Button>
                                </div>
                                <div className="flex flex-grow items-center justify-center my-auto" onClick={toggleIcon}>
                                    {isDarkMode ? (
                                        <Button>
                                            <BrightnessHigh size={"24px"} />
                                        </Button>
                                    ) : (
                                        <Button>
                                            <MoonStarsFill size={"24px"} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default PPTEditingPageNavbar;
