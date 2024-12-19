import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from '../ui/button';
import { useNavigation } from "../Navigation/Navigate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { BrightnessHigh, MoonStarsFill } from "react-bootstrap-icons";

interface LandingPageNavbarProps {
    isDarkMode: boolean;
    toggleIcon: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    toggleBarIcon: () => void;
}

const LandingPageNavbar: React.FC<LandingPageNavbarProps> = ({
    isDarkMode,
    toggleIcon,
    isOpen,
    setIsOpen,
    toggleBarIcon
}) => {
    const { handleButtonClick } = useNavigation();
    const [isLargeScreen, setIsLargeScree] = useState(window.innerWidth);
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown  
    const [showButtons, setShowButtons] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const isScrolledRef = useRef(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isIconVisible, setIsIconVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                if (!isScrolledRef.current) {
                    isScrolledRef.current = true;
                    setIsScrolled(true);
                    setShowButtons(false); // Close dropdown on scroll
                    setIsOpen(false);
                }
            } else {
                if (isScrolledRef.current) {
                    isScrolledRef.current = false;
                    setIsScrolled(false);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [setIsOpen]);

    const handleToggleBarButtons = () => {
        setShowButtons((prevState) => !prevState);
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowButtons(false); // Close dropdown if clicked outside
            setIsOpen(false);
        }
    }, [setIsOpen]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    // Handle button clicks to close the dropdown
    const handleCloseDropdown = () => {
        setShowButtons(false); // Close dropdown
        setIsOpen(false);
    };

    useEffect(() => {
        // Function to update the width state
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        // Function to update the width state
        const handleResize = () => {
            // Get the current window width
            const windowWidth = window.innerWidth;
            setIsLargeScree(window.innerWidth);

            // Update the icon visibility based on window width
            setIsIconVisible(windowWidth >= 540);
        };

        // Initial check on component mount  
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className={`lg:p-2.5 px-3.5 py-2.5 lg:pl-6 border-b flex items-center sticky top-0 z-50 dark:bg-zinc-950/60 transition-shadow bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isScrolled ? "shadow-xl" : ""} `}> 
        {/* No use of isLargeScreen here */}
            <div className="flex items-center select-none" onClick={() => handleButtonClick('/')}>
                <div className='flex justify-center items-center cursor-pointer w-10 lg:w-fit'>
                    <img src="./assets/Navbar/logo.webp" alt="Logo" className="lg:h-10 rounded-3xl border border-black" />
                </div>
                <div className='inline-block pl-2 cursor-pointer'>
                    <span className="font-Varino font-bold lg:text-2xl text-black dark:text-white">
                        PROMPTSLIDE
                    </span>
                </div>
            </div>
            <div className="w-fit flex ml-auto">
                {isIconVisible ? (
                    <>
                        <div className="hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer" onClick={toggleIcon}>
                            {isDarkMode ? (
                                <BrightnessHigh size={"28px"} />
                            ) : (
                                <MoonStarsFill size={"28px"} />
                            )}
                        </div>
                        <div className="border-l border-black dark:border-white h-9 ml-4"></div>
                        <div>
                            <Button className="mx-4 font-Degular text-md h-9" onClick={() => handleButtonClick('/login')}>Log In</Button>
                            <Button className="mr-4 font-Degular text-md h-9" onClick={() => handleButtonClick('/signup')}>Sign Up</Button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Small Screen */}
                        <div className="relative" ref={dropdownRef}>
                            <div onClick={handleToggleBarButtons}>
                                {isOpen ? (
                                    <FontAwesomeIcon icon={faX} fontSize={"20px"} onClick={toggleBarIcon} />
                                ) : (
                                    <FontAwesomeIcon icon={faBars} fontSize={"20px"} onClick={toggleBarIcon} />
                                )}
                            </div>
                            {showButtons && (
                                <div className="absolute top-12 transform -translate-x-full rounded-lg shadow-2xl p-6 border border-gray-300 dark:border-gray-700 transition-all duration-500 bg-white dark:bg-zinc-950 h-52 flex items-center justify-center">
                                    <div className="flex min-w-[238px]" style={{ width: `${screenWidth - 106}px` }}>
                                        <div className='mx-auto' onClick={() => { toggleIcon(); handleCloseDropdown() }}>
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
                                        <Button className="font-Degular text-md mx-auto" onClick={() => { handleButtonClick('/login'); handleCloseDropdown(); }}>Log in</Button>
                                        <Button className="font-Degular text-md mx-auto" onClick={() => { handleButtonClick('/signup'); handleCloseDropdown(); }}>Sign Up</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LandingPageNavbar;