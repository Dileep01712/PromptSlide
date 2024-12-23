import React from 'react';
import { useLocation } from 'react-router-dom';
import LandingPageNavbar from '../Navbars/LandingPageNavbar';
import PPTEditingPageNavbar from '../Navbars/PPTEditingPageNavbar';

interface MainLayoutProps {
    isDarkMode: boolean;
    toggleIcon: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    toggleBarIcon: () => void;
}

const MainLayout: React.FC<React.PropsWithChildren<MainLayoutProps>> = ({
    children,
    isDarkMode,
    toggleIcon,
    isOpen,
    setIsOpen,
    toggleBarIcon,
}) => {
    const location = useLocation();

    const renderNavbar = () => {
        switch (location.pathname) {
            case '/':
                return <LandingPageNavbar isDarkMode={isDarkMode} toggleIcon={toggleIcon} isOpen={isOpen} toggleBarIcon={toggleBarIcon} setIsOpen={setIsOpen} />;
            case '/ppt-editing':
                return <PPTEditingPageNavbar isDarkMode={isDarkMode} toggleIcon={toggleIcon} isOpen={isOpen} toggleBarIcon={toggleBarIcon} setIsOpen={setIsOpen} />;
            default:
                return <LandingPageNavbar isDarkMode={isDarkMode} toggleIcon={toggleIcon} isOpen={isOpen} toggleBarIcon={toggleBarIcon} setIsOpen={setIsOpen} />;
        }
    };

    return (
        <div>
            {renderNavbar()}
            <main>{children}</main>
        </div>
    );
};

export default MainLayout;
