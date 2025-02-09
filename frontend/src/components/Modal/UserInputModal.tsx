import React, { useState, useRef } from "react";
import { Button } from '../ui/button';
import Themes from '../Themes/Themes';
import ModalTooltip from "../Tooltip/ModalTooltip";
import { useNavigation } from '../Navigation/Navigate';

interface UserInputModalProps {
    themeId: number;
    closeModal: () => void;
    isOpen: boolean;
}

const UserInputModal: React.FC<UserInputModalProps> = ({ themeId, isOpen, closeModal }) => {
    // Error messages and state
    const [titleWarning, setTitleWarning] = useState("");
    const [slideLimitWarning, setSlideLimitWarning] = useState("");
    const [fileLimitWarning, setFileLimitWarning] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [file, setFile] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { handleButtonClick } = useNavigation();
    const [formData, setFormData] = useState<{
        title: string;
        tone: string;
        language: string;
        numberOfSlides: string;
        style: number;
    }>({
        title: "",
        tone: "Professional",
        language: "English",
        numberOfSlides: "7",
        style: themeId ?? 1,
    });

    // Synchronous validation helper function for title
    const validateTitle = (value: string): string => {
        const trimmed = value.trim();
        const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

        // Condition 1: Disallow URLs in the title.
        const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?/gi;
        if (urlPattern.test(value)) return "Links are not allowed in the title!";

        // Condition 2: Ensure title is not empty.
        if (!trimmed) return "Title cannot be empty!";

        // Condition 3: Check for minimum word count.
        if (wordCount < 2) return "Title must have at least 2 words.";

        // Condition 4: Check for maximum word count.
        if (wordCount > 15) return "Title cannot exceed 15 words.";

        // Condition 5: Minimum character length.
        if (trimmed.length < 10) return "Title must be at least 10 characters long.";

        // Condition 5: Disallow HTML tags.
        const htmlTagPattern = /<\/?[a-z][\s\S]*?>/i;
        if (htmlTagPattern.test(value)) return "HTML tags are not allowed in the title!";

        // Condition 6: Ensure title contains at least one meaningful word
        const meaningfulWordPattern = /\b[a-zA-Z]{3,}\b/;
        if (!meaningfulWordPattern.test(trimmed)) return "Title must contain at least one meaningful word (min 3 letters).";

        return "";
    };

    // Synchronous validation helper function for number of slides
    const validateSlides = (value: number): string => {
        if (value === null) return "The number of slides is required.";
        if (value < 6 || value > 15) return "The number should be between 6 and 15.";
        return "";
    };

    // Input change handler
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const warningMessage = validateTitle(inputValue);
        setTitleWarning(warningMessage);
        setFormData((prev) => ({ ...prev, title: inputValue }));
    };

    // Input change handler
    const handleSlideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get the string value from the input
        const inputValue = event.target.value;

        // Always update the state with the string from the input
        setFormData((prev) => ({ ...prev, numberOfSlides: inputValue }));

        // If the field is empty, set a warning and return immediately.
        if (inputValue === "") {
            setSlideLimitWarning("The number of slides is required.");
            return;
        }

        // Try to parse the input as a number
        const numericValue = parseInt(inputValue, 10);

        // If the parsing fails, show an error
        if (isNaN(numericValue)) {
            setSlideLimitWarning("Invalid number.");
            return;
        }

        // Validate the numeric value (your validateSlides should expect a number)
        const warningMessage = validateSlides(numericValue);
        setSlideLimitWarning(warningMessage);
    };

    // Generate presentation button
    const handleMouseEnter = () => {
        setIsHovered(true);
        setTimeout(() => {
            setIsHovered(false);
        }, 300);
    };

    // Upload file handler
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {
            const fileArray = Array.from(files);

            // Check if total files exceed 1
            if (fileArray.length + file.length > 1) {
                setFileLimitWarning("You can only upload up to 1 file.");
                setTimeout(() => {
                    setFileLimitWarning('');
                }, 8000);
                return;
            }

            // Filter valid files based on size (max 10MB)
            const filteredFiles = fileArray.filter((file) => {
                const validFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

                // Check file type
                if (!validFileTypes.includes(file.type)) {
                    setFileLimitWarning("Only .pdf and .docx files are allowed.");
                    setTimeout(() => {
                        setFileLimitWarning('');
                    }, 8000);
                    return false;
                }

                // Check if file size exceeds 20MB
                const fileSizeMB = file.size / (1024 * 1024);
                if (fileSizeMB > 10) {
                    setFileLimitWarning("The selected file is too large. Please upload a file smaller than 10MB.");
                    setTimeout(() => {
                        setFileLimitWarning('');
                    }, 8000);
                    return false;
                }
                return true;
            });

            // Truncate file names to 35 characters (with ellipsis) if needed
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

            // Only add new valid files to state, avoiding duplicates
            setFile((prevFiles) => {
                const newFiles = [...prevFiles, ...processedFiles].slice(0, 1);
                return newFiles;
            });
        }
    };

    // Remove file handler
    const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        event.preventDefault();
        const updatedFiles = file.filter((_, i) => i !== index);
        setFile(updatedFiles);

        // Reset the file input after removing a file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";  // Clear the input's file history
        }
    };

    const handleFileButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handler to update the formData style when a theme is selected
    const handleThemeSelect = (selectedThemeId: number) => {
        setFormData((prevData) => ({ ...prevData, style: selectedThemeId }));
        console.log("Updated formData style:", selectedThemeId);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Run validations immediately
        const titleError = validateTitle(formData.title);
        const slidesError = validateSlides(Number(formData.numberOfSlides));
        let fileError = "";
        if (file.length > 1) {
            fileError = "You can only upload up to 1 file.";
        }

        // Update error state for display
        setTitleWarning(titleError);
        setSlideLimitWarning(slidesError);
        setFileLimitWarning(fileError);

        // Block submission if any error exists
        if (titleError || slidesError || fileError) {
            console.log("Form has errors. Submission blocked.");
            return;
        }

        // Prepare form data for submission
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('tone', formData.tone);
        formDataToSend.append('language', formData.language);
        formDataToSend.append('num_slides', formData.numberOfSlides.toString());
        formDataToSend.append('style', formData.style.toString());

        if (file.length > 0) {
            // Only append up to 1 files
            file.forEach((f) => formDataToSend.append("file", f));
        }

        console.log("Form Data Sent to Backend:", formData);
        for (const pair of formDataToSend.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/user_input', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            const result = await response.json();
            console.log('Success:', result)

            // Clear form and file inputs after successfull submission
            setFormData({
                title: '',
                tone: 'Professional',
                language: 'English',
                numberOfSlides: "7",
                style: 1,
            });
            setFile([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.log('Error:', error)
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed top-0 right-0 left-0 p-1 py-6 z-50 flex justify-center items-center w-full h-full bg-zinc-950/50 overflow-y-auto">
                    <div className="lg:w-1/2 md:w-fit mt-28">
                        {/* Modal content */}
                        <div className="p-5 sm:px-8 bg-white rounded-lg shadow dark:bg-zinc-800">

                            {/* Modal header */}
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="md:text-3xl text-2xl text-black dark:text-white font-Degular">Create your presentation</h1>
                                <Button type="button" className="relative -right-2 p-2 bg-transparent hover:bg-gray-200 text-black dark:text-white rounded text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600" onClick={closeModal}>
                                    <svg className="h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                </Button>
                            </div>

                            <form method='post' className="font-Lato" onSubmit={handleSubmit}>
                                {/* Topic Input */}
                                <div className="md:h-24 pb-4">
                                    <h3 className="md:text-lg text-base mb-2 text-black dark:text-white font-semibold">Topic</h3>
                                    <input type="text" value={formData.title} onChange={handleTitleChange} className="md:h-auto h-8 border border-gray-300 rounded-md p-2 w-full text-black focus:outline-none text-sm" placeholder="The negative effects of social media" />
                                    {/* Warning Message */}
                                    {titleWarning && (
                                        <p className="text-red-500 text-xs absolute">{titleWarning}</p>
                                    )}
                                </div>

                                {/* Dropdowns for Writing Tone, Language, and Number of Slides */}
                                <div className="gap-4 w-full flex flex-col sm:flex-row md:h-24 pb-4 flex-wrap">
                                    {/* Writing Tone */}
                                    <div>
                                        <h3 className="md:text-lg text-base mb-2 text-black dark:text-white font-semibold">Writing tone</h3>
                                        <select value={formData.tone} onChange={(e) => setFormData({ ...formData, tone: e.target.value })} className="pl-4 bg-white pr-12 rounded border border-gray-300 w-full placeholder:text-gray-600 focus:outline-none md:h-9 h-8 text-gray-900 text-sm">
                                            <option value="Professional">Professional</option>
                                            <option value="Casual">Casual</option>
                                            <option value="Creative">Creative</option>
                                            <option value="Formal">Formal</option>
                                        </select>
                                    </div>

                                    {/* Language */}
                                    <div className='flex-1'>
                                        <h3 className="md:text-lg text-base mb-2 text-black dark:text-white font-semibold">Language</h3>
                                        <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="pl-4 bg-white pr-12 rounded border border-gray-300 w-full placeholder:text-gray-600 focus:outline-none md:h-9 h-8 text-gray-900 text-sm">
                                            <option value="english">English</option>
                                            <option value="spanish">Spanish</option>
                                            <option value="french">French</option>
                                            <option value="german">German</option>
                                            <option value="italian">Italian</option>
                                            <option value="dutch">Dutch</option>
                                            <option value="russian">Russian</option>
                                            <option value="portuguese">Portuguese</option>
                                        </select>
                                    </div>

                                    {/* Number of Slides */}
                                    <div className='flex-1 lg:flex-0'>
                                        <h3 className="md:text-lg text-base mb-2 text-black dark:text-white font-semibold">Number of slides</h3>
                                        <input type="number" required value={formData.numberOfSlides} onChange={handleSlideChange} className="pl-5 bg-white rounded border border-gray-300 w-full appearance-none placeholder:text-gray-600 focus:outline-none md:h-9 h-8 text-gray-900 text-sm" />
                                        {/* Warning Message */}
                                        {slideLimitWarning && (
                                            <p className="text-red-500 text-xs absolute">{slideLimitWarning}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Files Upload Section */}
                                <div className="md:pb-0 md:h-24 pb-3">
                                    {/* Upload file tittel */}
                                    <div className="flex justify-between">
                                        <div className="flex">
                                            <h3 className="md:text-lg text-base mr-1 text-black dark:text-white font-semibold">Upload file{" "}<span className="text-sm text-gray-600 dark:text-gray-300 font-Degular">(optional)</span>
                                            </h3>
                                            <ModalTooltip text="You can upload a PDF or Word document for more details (maximum 1 file)">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} className="h-5 w-5 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                </svg>
                                            </ModalTooltip>
                                        </div>
                                    </div>

                                    <div className="grid flex-col my-2">
                                        <div className="grid md:grid-flow-col justify-start">
                                            {/* Hidden file input */}
                                            <input type="file" accept=".pdf, .docx" onChange={handleFileChange} ref={fileInputRef} className="hidden" />

                                            {/* Button and warning container (for md+) */}
                                            <div className="md:relative">
                                                <Button type="button" onClick={handleFileButtonClick} variant='outline' className="font-Lato rounded border-2 h-9 text-sm w-fit sm:mr-2 sm:mb-0 select-none dark:hover:border-gray-300 hover:border-black">
                                                    Upload File
                                                </Button>

                                                {/* Warning message (visible only on md+ screens) */}
                                                {fileLimitWarning && (
                                                    <p className="hidden md:block text-red-500 text-xs md:absolute w-96 mt-0.5">
                                                        {fileLimitWarning}
                                                    </p>
                                                )}
                                            </div>

                                            {/* List of uploaded files */}
                                            <div className={`flex flex-wrap md:ml-1 w-full md:mt-0 ${file.length > 0 ? "md:h- h-12" : "md:h-14"}`}>
                                                {file.length > 0 && (
                                                    <ul className="flex flex-wrap gap-3 md:mt-0 mt-2 h-fit">
                                                        {file.map((f, index) => (
                                                            <li key={index} className="flex items-center justify-between bg-gray-200 dark:bg-gray-950 p-1 rounded h-9 w-full sm:w-auto">
                                                                <span className="text-sm">{f.name}</span>
                                                                <Button variant='outline' className="ml-2 rounded-full w-5 h-5 flex items-center justify-center p-2.5" onClick={(event) => handleRemoveFile(event, index)}>
                                                                    &#10005; {/* X Button */}
                                                                </Button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {/* Warning message (mobile - hidden on md+) */}
                                            <div className="md:hidden mt-0.5">
                                                {fileLimitWarning && (
                                                    <p className="text-red-500 text-xs">{fileLimitWarning}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Style Section */}
                                <div>
                                    <h2 className='text-lg text-black dark:text-white font-semibold mb-2'>Styles</h2>
                                    {/* Style Previews*/}
                                    <div>
                                        <Themes onThemeSelect={handleThemeSelect} />
                                    </div>
                                </div>

                                {/* Modal Generate Button */}
                                <Button type='submit' className="flex bg-zinc-950 dark:bg-slate-100 dark:text-black dark:hover:text-white font-bold  h-12 rounded w-full hover:bg-gradient-to-l from-indigo-500 via-purple-600 to-indigo-500 md:mt-6 mt-4 select-none" onMouseEnter={handleMouseEnter} onMouseLeave={() => setIsHovered(false)} onClick={() => handleButtonClick('')}>
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
