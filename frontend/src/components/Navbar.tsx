import React from 'react';

interface NavbarProps {
    isLargeScreen: boolean,
    setIsLargeScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isLargeScreen }) => {
    return (
        <div className="bg-bodyColor p-2 font-Varino text-textColor flex justify-center items-center">
            <div className={`inline-block p-1 cursor-pointer ${isLargeScreen ? 'text-3xl' : 'ml-5 text-xl'}`}>
                PROMPTSLIDE
            </div>
        </div>
    );
};

export default Navbar;
