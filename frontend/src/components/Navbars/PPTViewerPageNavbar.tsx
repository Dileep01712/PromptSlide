import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { useNavigation } from '../Navigation/Navigate';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faBars, faDesktop, faDownload, faFilePdf, faFilePowerpoint, faX, faArrowRightFromBracket, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { MoonStarsFill, BrightnessHigh, PersonCircle } from 'react-bootstrap-icons';
import Icon from '@mdi/react';
import { mdiArrowLeftTop, mdiArrowRightTop } from '@mdi/js';
import axios from 'axios';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { useAccess } from '../context/useAccess';
import { useNavigate } from 'react-router-dom';

interface PPTViewerPageNavbarProps {
    isDarkMode: boolean;
    toggleIcon: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    toggleBarIcon: () => void;
    refreshToken: string | null;
    setRefreshToken: (token: string | null) => void;
    isLoggedIn: boolean;
}

const PPTViewerPageNavbar: React.FC<PPTViewerPageNavbarProps> = ({
    isDarkMode,
    toggleIcon,
    isOpen,
    setIsOpen,
    toggleBarIcon,
    refreshToken,
    setRefreshToken,
    isLoggedIn
}) => {
    const { handleButtonClick } = useNavigation();
    const [isLargeScreen] = useState(window.innerWidth >= 1024);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showButtons, setShowButtons] = useState(false);
    const [, setIsScrolled] = useState(false);
    const isScrolledRef = useRef(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const timeoutIds = useRef<NodeJS.Timeout[]>([]); // Use NodeJS.Timeout for compatibility
    const [filename, setFilename] = useState('Loading file name...');
    const [userDetails, setUserDetails] = useState<{ firstName: string; email: string } | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const iconRef = useRef<HTMLDivElement>(null);
    const { revokeAccess } = useAccess();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.screenY > 0) {
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

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [setIsOpen]);

    const handleToggleBarButtons = () => {
        setShowButtons((prevState) => !prevState);
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) || iconRef.current && !iconRef.current.contains(event.target as Node)) {
            setShowButtons(false); // Close dropdown if clicked outside
            setIsOpen(false);
            setShowDetails(false);
        }
    }, [setIsOpen]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleCloseDropdown = () => {
        setShowButtons(false); // Close dropdown
        setIsOpen(false);
    }

    useEffect(() => {
        const handleFullscreenChange = () => {
            // Check if the window size matches the screen size
            const isFullscreen = window.innerWidth === screen.width && window.innerHeight === screen.height;
            setIsFullscreen(isFullscreen);
        };

        // Listen for resize events to detect fullscreen changes
        window.addEventListener("resize", handleFullscreenChange);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleFullscreenChange);
        };
    }, []);

    // Listen for fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (isFullscreen) {
                    exitFullscreen();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isFullscreen]);

    // Enter fullscreen mode
    const enterFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    };

    // Exit fullscreen mode
    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    const handleDownload = async (type: string) => {
        setIsExpanded(false);
        try {
            let url;
            if (type === 'pptx') {
                url = 'http://127.0.0.1:8000/api/user/get-pptx';
            } else if (type === 'pdf') {
                url = 'http://127.0.0.1:8000/api/user/convert-ppt-to-pdf';
            } else {
                throw new Error('Invalid file type');
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to download file');

            // Log headers for debugging
            console.log("Response Headers:", response.headers);

            const contentDisposition = response.headers.get('Content-Disposition');
            console.log([...response.headers.entries()]);

            // Default filename fallback
            let filename = type === 'pptx' ? 'file.pptx' : 'file.pdf';

            if (contentDisposition) {
                // Use a regex to handle both standard and UTF-8 encoded filenames
                const filenameRegex = /filename\*=UTF-8''([^;]+)|filename="([^"]+)"|filename=([^;]+)/i;
                const matches = contentDisposition.match(filenameRegex);
                if (matches) {
                    // Use the UTF-8 encoded group first, then the quoted or unquoted filename
                    filename = decodeURIComponent(matches[1] || matches[2] || matches[3]);
                }
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', filename); // Set the extracted filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            addErrorMessage('Failed to download file. Please try again.');
        }
    };

    // Add an error message (limit to 5 messages)
    const addErrorMessage = (message: string) => {
        setErrorMessages(prev => {
            const newMessages = [...prev, message].slice(-5); // Keep only the last 5 messages
            return newMessages;
        });
    };

    // Clear a specific error message after 5 seconds
    useEffect(() => {
        if (errorMessages.length > 0) {
            const newTimeoutId = setTimeout(() => {
                setErrorMessages(prev => prev.slice(1)); // Remove the oldest message
            }, 5000);

            // Store the timeout ID for cleanup
            timeoutIds.current.push(newTimeoutId);
        }

        // Cleanup function to clear timeouts when the component unmounts or errorMessages change
        return () => {
            timeoutIds.current.forEach(id => clearTimeout(id)); // Clear all pending timeouts
            timeoutIds.current = []; // Reset the timeout IDs
        };
    }, [errorMessages]);

    // Define a function that fetches the file and extracts the filename
    const fetchFileName = async () => {
        try {
            const url = 'http://127.0.0.1:8000/api/user/get-pptx';
            const response = await fetch(url);

            // Check if the response is OK
            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }

            // Extract the Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');

            // Fallback filename in case extraction fails
            let extractedFilename = 'file.pptx';

            if (contentDisposition) {
                // Use regex to extract filename from the header
                const filenameRegex = /filename\*=UTF-8''([^;]+)|filename="([^"]+)"|filename=([^;]+)/i;
                const matches = contentDisposition.match(filenameRegex);
                if (matches) {
                    extractedFilename = decodeURIComponent(matches[1] || matches[2] || matches[3]);
                }
            }

            // Remove the file extension from the filename
            const dotIndex = extractedFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                extractedFilename = extractedFilename.substring(0, dotIndex);
            }

            console.log(extractedFilename);
            setTimeout(() => {
                // Set the filename to state so that the input displays it
                setFilename(extractedFilename);
            }, 4000);

        } catch (error) {
            console.error('Error fetching file name:', error);
            setFilename('Failed to load file name');
        }
    };

    // Call fetchFileName when the component mounts
    useEffect(() => {
        fetchFileName();
    }, []);

    // Function to fetch user details using the token from state.
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!refreshToken) return; // No token means user isn't logged in.
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/user/details", {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });
                console.log(response);
                setUserDetails(response.data);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        };

        fetchUserDetails();
    }, [refreshToken]);

    // Toggle the display of user details when the icon is clicked.
    const handleToggleDetails = () => {
        setShowDetails((prev) => !prev);
    };

    const handleLogOut = () => {
        setRefreshToken(null);

        // Optionally, if your provider does not automatically clear localStorage:
        localStorage.removeItem("refreshToken");

        // Redirect the user to home page
        handleButtonClick('/');

        console.log("User logged out successfully!");
    };

    const handleStartOver = () => {
        revokeAccess(); // Remove access before navigating
        navigate("/user_input");
    };

    return (
        <>
            <div className={`flex items-center justify-between lg:p-2.5 px-3.5 py-2.5 lg:pl-6 border-b sticky top-0 dark:bg-zinc-950 z-20 ${isFullscreen ? "hidden" : "flex"}`}>

                {/* Left (Start) */}
                <div className="flex items-center select-none w-fit" onClick={() => handleButtonClick('/')}>
                    <div className='flex justify-center items-center cursor-pointer w-10 lg:w-fit'>
                        <img src="./assets/Navbar/logo.webp" alt="Logo" className="lg:h-10 rounded-3xl border border-black" />
                    </div>
                    <div className='inline-block pl-2 cursor-pointer'>
                        <span className="font-Varino font-bold lg:text-2xl text-black dark:text-white">
                            PROMPTSLIDE
                        </span>
                    </div>
                </div>

                {/* Center */}
                <div className="flex items-center justify-center w-96 h-9 mx-auto">
                    <div className='hidden lg:block w-full'>
                        <input type="text" value={filename} readOnly className="md:h-8 h-9 border hover:border-gray-300 outline-none rounded w-full bg-transparent px-2 font-Degular text-lg select-none" />
                    </div>
                </div>

                {/* Right (End) */}
                <div className="flex items-center justify-end">
                    {isLargeScreen ? (
                        // Large Screen Buttons
                        <div className='flex'>

                            {/* Start Over*/}
                            <div className='my-auto'>
                                <Button variant='outline' onClick={handleStartOver} className="font-Degular text-md mx- h-9 select-none" >
                                    <FontAwesomeIcon icon={faRotateRight} className='mr-3' />
                                    Start Over
                                </Button>
                            </div>

                            {/* Present */}
                            <div className='my-auto'>
                                <Button variant='outline' onClick={isFullscreen ? exitFullscreen : enterFullscreen} className="font-Degular text-md mx-2 h-9 select-none" >
                                    <FontAwesomeIcon icon={faDesktop} className='mr-3' />
                                    Present
                                </Button>
                            </div>

                            {/* Download button */}
                            <div className={`relative my-auto ${window.innerWidth < 1024 ? 'hidden' : 'visible'}`}>
                                <div className="flex items-center">
                                    <Button variant="outline" onClick={() => handleDownload('pptx')} className="rounded-r-none border-r-0 h-9 select-none">
                                        <FontAwesomeIcon icon={faFilePowerpoint} className="mr-2" />
                                        Download
                                    </Button>
                                    <div className="border-l h-9 bg-inherit dark:bg-inherit"></div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="rounded-l-none h-9">
                                                <FontAwesomeIcon icon={faAngleDown} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="p-0 z-0 top-3 relative">
                                            <DropdownMenuItem className='cursor-pointer h-9' onClick={() => handleDownload('pdf')}>
                                                <FontAwesomeIcon icon={faFilePdf} className="mx-1.5" />
                                                Download as PDF
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {errorMessages.length > 0 && (
                                    <div className={`absolute mt-4 -left-10 space-y-2 ${isExpanded ? "top-20" : "top-full"}`}>
                                        {errorMessages.map((error, index) => (
                                            <div className="flex items-center p-3 text-sm w-[310px] text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                                <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                                </svg>
                                                <p onClick={() => setErrorMessages(prev => prev.filter((_, i) => i !== index))}>
                                                    {error}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-l border-black dark:border-white h-9 mx-2 my-auto"></div>

                            {/* Mode Button */}
                            <div className="hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer my-auto" onClick={toggleIcon}>
                                {isDarkMode ? (
                                    <BrightnessHigh size={"28px"} />
                                ) : (
                                    <MoonStarsFill size={"28px"} />
                                )}
                            </div>

                            {/* User Login/Signup Buttons */}
                            <div className="border-l border-black dark:border-white h-9 ml-2 my-auto"></div>
                            <div ref={iconRef}>
                                {isLoggedIn ? (
                                    <div ref={iconRef}>
                                        <div className="ml-2 mr-4 hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-full p-1 cursor-pointer"
                                            onClick={handleToggleDetails}>
                                            <PersonCircle size="32px" />
                                        </div>
                                        {showDetails && (
                                            <div className="border-2 absolute top-16 right-1 bg-white dark:bg-zinc-950 p-5 shadow-lg rounded-lg w-72 z-10">
                                                <h3 className="text-lg font-semibold">Personal Information</h3>
                                                <div className="text-sm my-5">
                                                    <p className="mb-1">
                                                        <span className="font-medium">Name:</span> {userDetails?.firstName}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Email:</span> {userDetails?.email}
                                                    </p>
                                                </div>
                                                <div className="border-b my-5"></div>
                                                <Button onClick={handleLogOut} className="flex items-center justify-center w-full select-none">
                                                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" fontSize={"20px"} />
                                                    <span className="font-medium">Log Out</span>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <Button className="mx-4 font-Degular text-md h-9 select-none" onClick={() => handleButtonClick('/login')}>Log in</Button>
                                        <Button className="mr-4 font-Degular text-md h-9 select-none" onClick={() => handleButtonClick('/signup')}>Sign up</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (

                        // Small Screen Buttons
                        <div className="relative" ref={dropdownRef}>
                            <div onClick={handleToggleBarButtons}>
                                {isOpen ? (
                                    <FontAwesomeIcon icon={faX} fontSize={"20px"} className='cursor-pointer' onClick={toggleBarIcon} />
                                ) : (
                                    <FontAwesomeIcon icon={faBars} fontSize={"20px"} className='cursor-pointer' onClick={toggleBarIcon} />
                                )}
                            </div>
                            {showButtons && (
                                <div className="absolute top-12 transform -translate-x-full rounded-lg shadow-lg p-6 border border-gray-300 dark:border-gray-700 w-min transition-all duration-500 bg-white dark:bg-zinc-950 h-52 flex items-center justify-center">
                                    <div className="flex w-64">
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
                    )}
                </div>

            </div >

            {/* Small Screen: Undo/Redu and Present/Download Icons */}
            < div className='flex lg:hidden bg-gray-300 dark:bg-zinc-900 h-14 items-center justify-center border-b' >
                {/* Undo/Redo Icons */}
                <div className="flex items-center mr-2" >
                    <div className='hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer md:mx-5'>
                        <Icon path={mdiArrowLeftTop} size="27px" />
                    </div>

                    <div className='hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer'>
                        <Icon path={mdiArrowRightTop} size="27px" />
                    </div>
                </div >
                {/* Present & Download Icons */}
                <div className='flex' >
                    <Button variant='outline' className="font-Degular text-md mr-2 h-9">
                        <FontAwesomeIcon icon={faDesktop} className='mr-3' />
                        Present
                    </Button>
                    <Button variant='outline' className="font-Degular text-md h-9 mx-auto">
                        <FontAwesomeIcon icon={faDownload} className='mr-3' />
                        Export
                    </Button>
                </div >
            </div >
        </>
    );
};

export default PPTViewerPageNavbar;
