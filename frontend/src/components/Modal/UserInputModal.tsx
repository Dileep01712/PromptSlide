import React, { useState, useRef } from "react";
import { Button } from '../ui/button';
import Themes from '../Themes/Themes';
import handleSwitch from '../Themes/handleSwitch';
import ModalTooltip from "../Tooltip/ModalTooltip";
import { useNavigation } from '../Navigation/Navigate';

interface UserInputModalProps {
    setActiveDiv: React.Dispatch<React.SetStateAction<number>>;
    activeDiv: number;
    closeModal: () => void;
    isOpen: boolean;
}

const UserInputModal: React.FC<UserInputModalProps> = ({ activeDiv, setActiveDiv, isOpen, closeModal }) => {
    const [slideCount, setSlideCount] = useState(7);
    const [warningA, setWarningA] = useState('');
    const [warningB, setWarningB] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { handleButtonClick } = useNavigation();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10); // Ensure the value is treated as a number

        // Set the slide count to the user's input
        setSlideCount(value);

        // Display a warning if the value is outside the range
        if (value < 6 || value > 14) {
            setWarningA('The number should be between 6 and 14.');
        } else {
            setWarningA('');
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);

        setTimeout(() => {
            setIsHovered(false);
        }, 300);
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {
            const fileArray = Array.from(files);

            // Check if total files exceed 2
            if (fileArray.length + uploadedFiles.length > 2) {
                setWarningB("You can only upload up to 2 files.");
                setTimeout(() => {
                    setWarningB('');
                }, 7000);
                return;
            }

            const filteredFiles = fileArray.filter((file) => {
                // Check if file size exceeds 20MB
                const fileSizeMB = file.size / (1024 * 1024);
                if (fileSizeMB > 20) {
                    setWarningB(`File "${file.name}" is larger than 20MB and cannot be uploaded.`);
                    setTimeout(() => {
                        setWarningB('');
                    }, 7000);
                    return false;
                }
                return true;
            });

            // Function to truncate file names to 35 characters (with ellipsis)
            const truncateFileName = (name: string, maxLength: number) => {
                if (name.length <= maxLength) return name; // Show the full name if it's within the limit
                const start = name.substring(0, 16); // First 16 characters
                const end = name.substring(name.length - 16); // Last 16 characters
                return `${start}...${end}`;
            };

            // Process the valid files
            const processedFiles = filteredFiles.map((file) => {
                const truncatedName = truncateFileName(file.name, 35); // Truncate only if the name exceeds 35 characters
                return new File([file], truncatedName, { type: file.type });
            });

            setUploadedFiles([...uploadedFiles, ...processedFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(updatedFiles);
    };

    const handleFileButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed top-0 right-0 left-0 p-4 py-6 z-50 flex justify-center items-center w-full h-full bg-zinc-950/60 overflow-y-auto">
                    <div className="lg:w-1/2 md:w-9/12 md:mt-32 mt-60 ">
                        {/* Modal content */}
                        <div className="relative py-8 px-6 sm:px-8 bg-white rounded-lg shadow dark:bg-gray-700">

                            {/* Modal header */}
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="md:text-3xl text-2xl text-black dark:text-white font-Degular">Create your presentation</h1>
                                <Button type="button" className="absolute top-2 right-2 p-2 bg-transparent hover:bg-gray-200 text-black dark:text-white rounded text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600" onClick={closeModal}>
                                    <svg className="h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </Button>
                            </div>

                            <form method='post' action="" className="font-Lato" onSubmit={(e) => { e.preventDefault(); }}>
                                {/* Modal Input Prompt */}
                                <div>
                                    <h3 className="md:text-lg text-base mb-2 text-black dark:text-white font-semibold">Topic</h3>
                                    <input type="text" className="md:h-auto h-8 border border-gray-300 rounded-md p-2 w-full mb-3 text-black focus:outline-none" placeholder="The negative effects of social media" />
                                </div>

                                {/* Modal Language Dropdown List */}
                                <div className="gap-4 w-full flex flex-col sm:flex-row md:h-24 pb-10 flex-wrap">

                                    <div>
                                        <h3 className="md:text-lg text-base mb-2 text-black dark:text-white font-semibold">Writing tone</h3>
                                        <select className="pl-4 bg-white pr-12 rounded border border-gray-300 w-full placeholder:text-gray-600 focus:outline-none focus:border-gray-900 md:h-9 h-8 text-gray-900 font-semibold text-sm">
                                            <option>Unspecified</option>
                                            <option value="Fun">Fun</option>
                                            <option value="Creative">Creative</option>
                                            <option value="Casual">Casual</option>
                                            <option value="Professional">Professional</option>
                                            <option value="Formal">Formal</option>
                                        </select>
                                    </div>

                                    <div className='flex-1'>
                                        <h3 className="md:text-lg text-base mb-2 text-black dark:text-white font-semibold">Language</h3>
                                        <select className="pl-4 bg-white pr-12 rounded border border-gray-300 w-full placeholder:text-gray-600 focus:outline-none focus:border-gray-900 md:h-9 h-8 text-gray-900 font-semibold text-sm">
                                            <option>Auto</option>
                                            <option value="en">English</option>
                                            <option value="hi">हिन्दी</option>
                                            <option value="mr">मराठी</option>
                                            <option value="gu">ગુજરાતી</option>
                                            <option value="pa">ਪੰਜਾਬੀ</option>
                                            <option value="ur">اردو</option>
                                            <option value="bn">বাংলা</option>
                                            <option value="te">తెలుగు</option>
                                            <option value="ta">தமிழ்</option>
                                            <option value="zh">中文</option>
                                            <option value="es">Español</option>
                                            <option value="pt">Português</option>
                                            <option value="de">Deutsch</option>
                                            <option value="it">Italiano</option>
                                            <option value="fr">Français</option>
                                            <option value="ru">Русский</option>
                                            <option value="ja">日本語</option>
                                            <option value="tr">Türkçe</option>
                                            <option value="ko">한국어</option>
                                            <option value="vi">Tiếng Việt</option>
                                            <option value="yo">Yorùbá</option>
                                            <option value="jv">Basa Jawa</option>
                                            <option value="pl">Polski</option>
                                            <option value="uk">Українська</option>
                                            <option value="ms">Bahasa Melayu</option>
                                        </select>
                                    </div>

                                    <div className='flex-1 lg:flex-0'>
                                        <h3 className="md:text-lg text-base mb-2 text-black dark:text-white font-semibold">Number of slides</h3>
                                        <input type="number" required autoComplete="off" value={slideCount} onChange={handleInputChange} className="pl-4 bg-white rounded border border-gray-300 w-full appearance-none placeholder:text-gray-600 focus:outline-none focus:border-gray-900 md:h-9 h-8 text-gray-900 font-semibold text-sm" />
                                        {/* Warning Message */}
                                        {warningA && (
                                            <p className={`text-red-600 text-xs mt-2 absolute ${warningA ? 'visible' : 'invisible'}`}>{warningA}</p>
                                        )}
                                    </div>

                                </div>

                                {/* Modal Upload Files */}
                                <div className="mb-3 md:h-24 md:pb-0 pb-8">
                                    <div className="flex justify-between">
                                        <div className="flex">
                                            <h3 className="md:text-lg text-base mb-1 mr-1 text-black dark:text-white font-semibold">
                                                Upload files <span className="text-sm text-gray-600 font-Degular">(optional)</span>
                                            </h3>
                                            <ModalTooltip text="Share more details about this topic by uploading a PDF/Word, Max 2 files">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} className="h-5 w-5 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                </svg>
                                            </ModalTooltip>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row mt-2">
                                        {/* Hidden file input */}
                                        <input type="file" accept=".pdf, .doc, .docx" multiple onChange={handleFileChange} ref={fileInputRef} className="hidden" />

                                        {/* Button to trigger file input */}
                                        <Button onClick={handleFileButtonClick} variant='outline' className="font-Lato rounded border h-8 text-sm w-fit sm:mr-2 mb-2 sm:mb-0">
                                            Upload File
                                        </Button>

                                        {/* List of uploaded files */}
                                        <div className="flex flex-wrap md:justify-center w-full md:mt-0 mt-2">
                                            {uploadedFiles.length > 0 && (
                                                <ul className="flex flex-wrap gap-3">
                                                    {uploadedFiles.map((file, index) => (
                                                        <li key={index} className="flex items-center justify-between bg-gray-200 p-1 rounded h-8 w-full sm:w-auto">
                                                            <span className="text-sm">{file.name}</span>
                                                            <Button variant='outline' className="ml-2 rounded-full w-5 h-5 flex items-center justify-center p-2.5" onClick={() => handleRemoveFile(index)}>
                                                                &#10005; {/* X Button */}
                                                            </Button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    {/* Warning Message */}
                                    {warningB && (
                                        <p className={`text-red-600 text-xs md:ml-28 mr-6 mt-2 absolute ${warningB ? 'visible' : 'invisible'}`}>{warningB}</p>
                                    )}
                                </div>

                                {/* Modal Themes Buttons */}
                                <div>
                                    <h2 className='text-lg text-black dark:text-white font-semibold mb-2'>Style</h2>
                                    <div className="justify-between mb-4">

                                        {/* Dropdown for small devices */}
                                        <div className="sm:hidden mb-4">
                                            <select className="border border-gray-300 h-8 w-full rounded focus:outline-none focus:border-gray-900" onChange={(e) => handleSwitch(setActiveDiv, Number(e.target.value))} value={activeDiv} // Keep the selected option in sync with the active div
                                            >
                                                <option value={1}>Essential Aesthetics</option>
                                                <option value={2}>Dynamic Colors</option>
                                                <option value={3}>Structured Shapes</option>
                                                <option value={4}>Polished Presentation</option>
                                            </select>
                                        </div>

                                        {/* Buttons for larger screens */}
                                        <div className="hidden sm:inline-flex w-full justify-between">
                                            <Button type="button" className={`h-8 ${activeDiv === 1 ? 'border-2 border-purple-500 ' : 'border-2'}`} variant="outline" onClick={(e) => {
                                                e.preventDefault(); handleSwitch(setActiveDiv, 1);
                                            }} >
                                                Essential Aesthetics
                                            </Button>
                                            <Button type="button" className={`h-8 ${activeDiv === 2 ? 'border-2 border-purple-500' : 'border-2'}`} variant="outline" onClick={(e) => {
                                                e.preventDefault(); handleSwitch(setActiveDiv, 2);
                                            }} >
                                                Dynamic Colors
                                            </Button>
                                            <Button type="button" className={`h-8 ${activeDiv === 3 ? 'border-2 border-purple-500' : 'border-2'}`} variant="outline" onClick={(e) => {
                                                e.preventDefault(); handleSwitch(setActiveDiv, 3);
                                            }} >
                                                Structured Shapes
                                            </Button>
                                            <Button type="button" className={`h-8 ${activeDiv === 4 ? 'border-2 border-purple-500' : 'border-2'}`} variant="outline" onClick={(e) => {
                                                e.preventDefault(); handleSwitch(setActiveDiv, 4);
                                            }} >
                                                Polished Presentation
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Modal Themes Section */}
                                    <div>
                                        <Themes activeDiv={activeDiv} />
                                    </div>

                                </div>

                                {/* Modal Generate Button */}
                                <Button type='submit' className="flex bg-zinc-950 text-white font-bold  h-12 rounded w-full hover:bg-gradient-to-l from-indigo-500 via-purple-600 to-indigo-500 mt-6" onMouseEnter={handleMouseEnter} onMouseLeave={() => setIsHovered(false)} onClick={() => handleButtonClick('/ppt-editing')}>
                                    <span className="flex items-center justify-center gap-2 font-Degular text-xl">
                                        <svg className="fill-current h-7 mt-2" viewBox="0 0 23 22" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M13.201 2.276 12.466.61c-.358-.813-1.512-.813-1.87 0L9.86 2.276c-.103.233-.29.42-.523.523l-1.666.735c-.813.358-.813 1.512 0 1.87l1.666.735c.234.103.42.29.523.523l.735 1.666c.358.813 1.512.813 1.87 0l.735-1.666c.103-.234.29-.42.523-.523l1.666-.735c.813-.358.813-1.512 0-1.87l-1.666-.735a1.021 1.021 0 0 1-.523-.523Z" className={`transition-transform duration-300 ${isHovered ? "scale-125" : ""}`}
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
                                        Generate presentation
                                    </span>
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
};

export default UserInputModal;
