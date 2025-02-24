import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LandingPageNavbar from '../Navbars/LandingPageNavbar';
import PPTViewerPageNavbar from '../Navbars/PPTViewerPageNavbar';
import { useAuth } from '../context/useAuth';
import { useAccess } from '../context/useAccess';

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
    toggleBarIcon
}) => {
    const location = useLocation();
    const { refreshToken, setRefreshToken } = useAuth();
    const { allowed } = useAccess();
    const isLoggedIn = Boolean(refreshToken);

    if (location.pathname === "/ppt_viewer" && !allowed) {
        return <Navigate to="/" replace />;
    }

    // Shared props to avoid repetition
    const sharedProps = { isDarkMode, toggleIcon, isOpen, toggleBarIcon, setIsOpen, refreshToken, setRefreshToken, isLoggedIn };

    const renderNavbar = () => {
        return location.pathname === '/ppt_viewer' ?
            <PPTViewerPageNavbar {...sharedProps} /> :
            <LandingPageNavbar {...sharedProps} />;
    };

    return (
        <div>
            {renderNavbar()}
            <main>{children}</main>
        </div>
    );
};

export default MainLayout;
