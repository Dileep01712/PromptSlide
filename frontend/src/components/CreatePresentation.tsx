import React, { useState } from 'react';
import { ReactTyped } from 'react-typed';
import { Button } from './ui/button';
import CommonFooter from './Footer/CommonFooter';
import UserInputModal from './Modal/UserInputModal';

const CreatePresentation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeDiv, setActiveDiv] = useState(1);

    const handleToggleModal = () => {
        setIsOpen(!isOpen);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);

        setTimeout(() => {
            setIsHovered(false);
        }, 300);
    };

    return (
        <>
            <div className='h-screen'>
                <div className="absolute w-full mx-auto">
                    {/* Background Image with Blur */}
                    <div className="absolute inset-0 h-screen md:left-0 -left-80" style={{
                        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url(./src/assets/UserInput/userInput.png)',
                        backgroundSize: 'cover',
                        filter: 'blur(2px)',
                    }}></div>

                    {/* Main Content */}
                    <div className="relative z-10 flex flex-col items-center mx-auto">
                        <div className='md:my-12 md:px-0 px-4 py-4'>
                            <h1 className="font-Degular h-36 md:h-auto text-gradient font-bold lg:text-5xl text-3xl text-center">
                                <ReactTyped
                                    strings={[
                                        'Unleash your ideas with Stunning Presentations',
                                        'Transform your concepts into Captivating Presentations',
                                        'Turn ideas into Engaging Stories with Slides',
                                        'Achieve Presentation Perfection in minutes',
                                        'Craft Professional Presentations effortlessly'
                                    ]}
                                    typeSpeed={70}
                                    backSpeed={40}
                                    backDelay={1500}
                                    loop={true}
                                />
                            </h1>

                            {/* Second heading with typing effect */}
                            <h1 className="font-Degular text-white lg:text-3xl text-xl text-center">
                                Effortless PowerPoint Templates, Tailored for you
                            </h1>
                        </div>
                    </div>

                    <div className='flex flex-col sm:flex-row justify-center items-center mx-auto py-5 md:py-8 relative px-4 lg:px-8'>
                        <div>
                            {/* Modal Toggle button */}
                            <>
                                <h3 className='flex flex-col sm:flex-row justify-center items-center text-white py-2 md:py-0'>
                                    <span className='text-center md:mr-4 text-lg'>Transform your next idea into reality with</span>
                                    <Button type="button" onClick={handleToggleModal} className="relative overflow-hidden rounded h-10 px-4 mt-4 md:mt-0 text-base text-gray-900 font-semibold bg-white hover:bg-gradient-to-l from-indigo-500 to-white transition-colors duration-0" onMouseEnter={handleMouseEnter}
                                        onMouseLeave={() => setIsHovered(false)}>

                                        {/* Button Content */}
                                        <span className={`relative flex items-center transition-all duration-500 text-gray-900 z-10`}>
                                            <svg className={`size-4 mr-2 fill-current z-10 overflow-visible`} width="16" height="16"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M13.201 2.276 12.466.61c-.358-.813-1.512-.813-1.87 0L9.86 2.276c-.103.233-.29.42-.523.523l-1.666.735c-.813.358-.813 1.512 0 1.87l1.666.735c.234.103.42.29.523.523l.735 1.666c.358.813 1.512.813 1.87 0l.735-1.666c.103-.234.29-.42.523-.523l1.666-.735c.813-.358.813-1.512 0-1.87l-1.666-.735a1.021 1.021 0 0 1-.523-.523Z"
                                                    className={`transition-transform duration-300 ${isHovered ? "scale-125" : ""}`}
                                                />
                                                <path
                                                    d="m3.628 6.347.493 1.118c.069.157.194.282.35.351l1.12.493a.686.686 0 0 1 0 1.256l-1.12.494a.685.685 0 0 0-.35.35l-.493 1.119a.686.686 0 0 1-1.256 0l-.493-1.119a.685.685 0 0 0-.351-.35L.409 9.565a.686.686 0 0 1 0-1.256l1.119-.493a.686.686 0 0 0 .35-.35l.494-1.12a.686.686 0 0 1 1.256 0Z"
                                                    className={`transition-transform duration-300 delay-75 ${isHovered ? "scale-125" : ""}`}
                                                />
                                                <path
                                                    d="m9.578 11.396.406.921c.057.13.16.232.289.29l.92.405c.45.198.45.836 0 1.034l-.92.406a.565.565 0 0 0-.29.29l-.405.92a.565.565 0 0 1-1.034 0l-.406-.92a.565.565 0 0 0-.29-.29l-.92-.406a.565.565 0 0 1 0-1.034l.92-.406a.565.565 0 0 0 .29-.289l.406-.92a.565.565 0 0 1 1.034 0Z"
                                                    className={`transition-transform duration-300 delay-100 ${isHovered ? "scale-125" : ""}`}
                                                />
                                            </svg>
                                            AI presentation maker
                                        </span>
                                    </Button>
                                </h3>
                            </>

                            {/* Modal */}
                            <UserInputModal activeDiv={activeDiv} setActiveDiv={setActiveDiv} closeModal={closeModal} isOpen={isOpen} />
                        </div>
                    </div>
                </div>
            </div >

            {/* Page Footer */}
            < CommonFooter />

        </ >
    );
}

export default CreatePresentation;
