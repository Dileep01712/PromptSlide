import React from 'react';
import { useLocation } from 'react-router-dom';
import LandingPageNavbar from './Navbars/LandingPageNavbar';

const MainLayout: React.FC<React.PropsWithChildren<object>> = ({ children }) => { 
    const location = useLocation();

    const renderNavbar = () => {
        switch (location.pathname) {
            case '/':
                return <LandingPageNavbar />;
            case '/about':
                return <LandingPageNavbar />;
            default:
                return <LandingPageNavbar />; // Default Navbar  
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