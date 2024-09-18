import React from 'react';
import { useLocation } from 'react-router-dom';
import LandingPageNavbar from '../Navbars/LandingPageNavbar';
import PPTEditingPageNavbar from '../Navbars/PPTEditingPageNavbar';

interface MainLayoutProps {
    isDarkMode: boolean;
    toggleIcon: () => void;
}

const MainLayout: React.FC<React.PropsWithChildren<MainLayoutProps>> = ({
    children,
    isDarkMode,
    toggleIcon,
}) => {
    const location = useLocation();

    const renderNavbar = () => {
        switch (location.pathname) {
            case '/':
                return <LandingPageNavbar isDarkMode={isDarkMode} toggleIcon={toggleIcon} />;
            case '/ppt-editing':
                return <PPTEditingPageNavbar isDarkMode={isDarkMode} toggleIcon={toggleIcon} />;
            default:
                return <LandingPageNavbar isDarkMode={isDarkMode} toggleIcon={toggleIcon} />;
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
