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
    const [isLargeScreen] = useState(window.innerWidth >= 1024);
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown  
    const [showButtons, setShowButtons] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const isScrolledRef = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                if (!isScrolledRef.current) {
                    isScrolledRef.current = true;
                    setIsScrolled(true);
                    setIsOpen(false);
                }
                setShowButtons(false);
                setIsOpen(false);
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
    }, [showButtons, setIsOpen]);

    const handleToggleBarButtons = () => {
        setShowButtons((prevState) => !prevState);
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowButtons(false);
            setIsOpen(false);
        }
    }, [setShowButtons, setIsOpen]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div className={`lg:p-2.5 px-3.5 py-2.5 lg:pl-14 border-b flex items-center sticky top-0 z-50 dark:bg-zinc-950/60 transition-shadow bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isScrolled ? "shadow-xl" : ""}`}>
            <div className="flex items-center select-none" onClick={() => handleButtonClick('/')}>
                <div className='flex justify-center items-center cursor-pointer w-10 lg:w-fit'>
                    <img src="./src/assets/Navbar/logo.webp" alt="Logo" className="lg:h-10 rounded-3xl border border-black" />
                </div>
                <div className='inline-block pl-2 cursor-pointer'>
                    <span className="font-Varino font-bold lg:text-2xl text-black dark:text-white">
                        PROMPTSLIDE
                    </span>
                </div>
            </div>
            <div className="w-fit md:flex ml-auto">
                {isLargeScreen ? (
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
                                <div className="absolute top-12 transform -translate-x-full rounded-lg shadow-lg p-6 border border-gray-300 dark:border-gray-700 w-min transition-all duration-500 bg-white dark:bg-zinc-950 h-52 flex items-center justify-center">
                                    <div className="flex w-64">
                                        <div className='mx-auto' onClick={toggleIcon}>
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
                                        <Button className="font-Degular text-md mx-auto" onClick={() => handleButtonClick('/login')}>Log in</Button>
                                        <Button className="font-Degular text-md mx-auto" onClick={() => handleButtonClick('/signup')}>Sign Up</Button>
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