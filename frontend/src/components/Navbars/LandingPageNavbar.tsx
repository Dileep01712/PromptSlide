import { useEffect, useState } from "react";
import { Button } from '../ui/button';
import { useNavigation } from "../Navigate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const LandingPageNavbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLargeScreen] = useState(window.innerWidth >= 1024);
    const { handleButtonClick } = useNavigation();
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
                setShowButtons(false);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleToggleButtons = () => {
        if (isScrolled) {
            setShowButtons(false);
        } else {
            setShowButtons(!showButtons);
        }
    };

    return (
        <div className={`lg:p-2.5 px-3.5 py-2.5 lg:pl-14 border-b flex items-center sticky top-0 z-50 transition-shadow bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isScrolled ? "shadow-xl" : ""}`}>
            <div className="flex items-center select-none" onClick={() => handleButtonClick('/')}>
                <div className='flex justify-center items-center cursor-pointer w-10 lg:w-fit'>
                    <img src="./src/assets/Navbar/logo.webp" alt="Logo" className="lg:h-10 rounded-3xl border border-black" />
                </div>
                <div className='inline-block pl-2 cursor-pointer font-Varino font-bold lg:text-2xl'>
                    PROMPTSLIDE
                </div>
            </div>
            <div className="w-fit md:flex ml-auto">
                {isLargeScreen ? (
                    <>
                        <Button className="ml-auto mr-4 font-Degular text-md">Log in</Button>
                        <Button className="mr-4 font-Degular text-md">Sign Up</Button>
                    </>
                ) : (
                    <>
                        <div className="relative">
                            <FontAwesomeIcon icon={faBars} fontSize={"20px"} onClick={handleToggleButtons} />
                            {showButtons && (
                                <div className="absolute top-11 transform -translate-x-full z-50 rounded-lg shadow-xl p-5 w-min transition-all duration-300 bg-blue-100">
                                    <div className="flex flex-row items-center h-40">
                                        <Button className="font-Degular text-md mx-7">Log in</Button>
                                        <Button className="font-Degular text-md mx-7">Sign Up</Button>
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
