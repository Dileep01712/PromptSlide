import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBars, faGear, faHistory, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { PersonCircle, WindowSidebar } from 'react-bootstrap-icons';

interface SidebarProps {
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    isLargeScreen: boolean,
    setIsLargeScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarExpanded, setIsSidebarExpanded, isLargeScreen }) => {
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const toggleLogout = () => {
        setIsLogoutVisible(!isLogoutVisible);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setIsLogoutVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`absolute top-0 left-0 z-20 p-3 bg-sidebarColor text-textColor flex flex-col ${isSidebarExpanded ? 'w-60' : 'w-14'} ${isLargeScreen ? 'h-screen' : 'h-full'}`}>
            <div className={`rounded w-fit cursor-pointer ${isSidebarExpanded ? 'p-1.5' : 'p-1.5'} ${isLargeScreen ? 'mr-auto hover:bg-bodyColor' : 'pt-1.5 pl-0 hover:bg-transparent mb-2'}`} onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
                {isLargeScreen ? (
                    <WindowSidebar size={"20px"} />
                ) : (
                    <FontAwesomeIcon icon={faBars} fontSize={"20px"} />
                )}
            </div>
            {isSidebarExpanded && (
                <>
                    <div className={`flex justify-between cursor-pointer mt-9 mb-2 hover:bg-bodyColor rounded ${isLargeScreen ? 'p-2.5' : 'p-1 pt-2 pb-2'}`}>
                        {isSidebarExpanded && <div className="new-chat-icon">New Chat</div>}
                        <div className={`${!isSidebarExpanded ? 'mx-auto' : ''}`}>
                            <FontAwesomeIcon icon={faPenToSquare} fontSize={"21px"} />
                        </div>
                    </div>

                    <div className='h-5/6 sm:h-4/6 md:h-5/6 overflow-y-auto rounded scrollbar'>
                        <div className={`flex hover:bg-bodyColor cursor-pointer ${isLargeScreen ? 'p-3' : 'p-1 pt-2 pb-2'}`}>
                            {isSidebarExpanded && <div className="h-fit ppt-history">PPT History</div>}
                            <div className={`ml-auto h-fit ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
                                <FontAwesomeIcon icon={faHistory} fontSize={"20px"} />
                            </div>
                        </div>
                    </div>

                    <div ref={modalRef} className={`rounded-t-lg mt-2 transition duration-300 ease-in-out ${isLogoutVisible ? 'shadow-top-custom' : 'shadow-top-none'}`} onClick={toggleLogout}>
                        <div className={`flex hover:bg-bodyColor rounded cursor-pointer ${isLargeScreen ? 'p-3' : 'p-1 pt-2 pb-2'}`}>
                            <div className={`mr-5 self-center ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
                                <PersonCircle size={"20px"} />
                            </div>
                            {isSidebarExpanded && <div className="account">Account</div>}
                        </div>
                        {isLogoutVisible && (
                            <div className="">
                                <div className={`flex hover:bg-bodyColor rounded cursor-pointer ${isLargeScreen ? 'p-3' : 'p-1 pt-2 pb-2'}`}>
                                    <div className={`mr-5 self-center ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
                                        <FontAwesomeIcon icon={faGear} fontSize={"20px"} />
                                    </div>
                                    {isSidebarExpanded && <div className="settings">Settings</div>}
                                </div>
                                <hr className='m-2' />
                                <div className={`flex hover:bg-bodyColor rounded cursor-pointer ${isLargeScreen ? 'p-3' : 'p-1 pt-2 pb-2'}`}>
                                    <div className={`mr-5 self-center ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} fontSize={"20px"} />
                                    </div>
                                    {isSidebarExpanded && <div className="logout">Log out</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Sidebar;
