import React from 'react';

interface NavbarProps {
    isLargeScreen: boolean,
    setIsLargeScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isLargeScreen }) => {
    return (
        <div className="h-fit bg-bodyColor p-2 font-Varino text-textColor flex justify-center items-center">
            <div className='flex justify-center items-center pr-3 cursor-pointer'>
                <img src="./src/assets/logo2.png" alt="Logo" className="w-auto h-10" />
            </div>
            <div className={`inline-block p-1 cursor-pointer ${isLargeScreen ? 'text-3xl' : 'ml-5 text-xl'}`}>
                PROMPTSLIDE
            </div>
        </div>
    );
};

export default Navbar;
