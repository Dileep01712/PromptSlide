import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faGear, faHistory, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { PersonCircle, WindowSidebar } from 'react-bootstrap-icons';

const Sidebar: React.FC = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);
    const [modalHeight, setModalHeight] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);

    const toggleLogout = () => {
        if (!isLogoutVisible) {
            setModalHeight(99);
        } else {
            setModalHeight(0);
        }
        setIsLogoutVisible(!isLogoutVisible);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setIsLogoutVisible(false);
            setModalHeight(0);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`fixed top-0 left-0 h-full ${isSidebarExpanded ? 'w-64' : 'w-16'} bg-sidebarColor text-textColor flex flex-col z-20 transition-width duration-300 ease`}>
            <div className="flex p-2 pb-3">
                <div className='self-center p-2 hover:bg-bodyColor rounded cursor-pointer' onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
                    <WindowSidebar size={"20px"} />
                </div>
                {isSidebarExpanded && (
                    <div className='self-center p-2 ml-auto hover:bg-bodyColor rounded cursor-pointer'>
                        <FontAwesomeIcon icon={faPenToSquare} fontSize={"21px"} />
                    </div>
                )}
            </div>

            <div className='flex p-3 m-1 cursor-pointer hover:bg-bodyColor rounded'>
                {isSidebarExpanded && <div className="new-chat-icon">New Chat</div>}
                <div className={`ml-auto self-center ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
                    <FontAwesomeIcon icon={faPenToSquare} fontSize={"21px"} />
                </div>
            </div>

            <div className='flex p-3 m-1 h-full overflow-hidden hover:bg-bodyColor rounded'>
                {isSidebarExpanded && <div className="ppt-history">PPT History</div>}
                <div className={`ml-auto cursor-pointer ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
                    <FontAwesomeIcon icon={faHistory} fontSize={"20px"} />
                </div>
            </div>

            <div ref={modalRef} className='rounded-t-lg m-1 transition-top duration-300 ease relative' style={{ top: `-${modalHeight}px` }} onClick={toggleLogout}>
                <div className='flex p-3 hover:bg-bodyColor rounded cursor-pointer'>
                    <div className={`mr-5 self-center ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
                        <PersonCircle size={"20px"} />
                    </div>
                    {isSidebarExpanded && <div className="account">Account</div>}
                </div>
                {isLogoutVisible && (
                    <div className="">
                        <div className='flex p-3 hover:bg-bodyColor rounded cursor-pointer'>
                            <div className={`mr-5 self-center ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
                                <FontAwesomeIcon icon={faGear} fontSize={"20px"} />
                            </div>
                            {isSidebarExpanded && <div className="settings">Settings</div>}
                        </div>
                        <hr className='m-2' />
                        <div className='flex p-3 hover:bg-bodyColor rounded cursor-pointer'>
                            <div className={`mr-5 self-center ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
                                <FontAwesomeIcon icon={faArrowRightFromBracket} fontSize={"20px"} />
                            </div>
                            {isSidebarExpanded && <div className="logout">Log out</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
