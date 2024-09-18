import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faCopy, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FileEarmarkPlus, FilesAlt } from "react-bootstrap-icons";
import CommonTooltip from "../Tooltip/CommonTooltip";

interface PPTEditingPageProps {
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    isPPTEditingExpanded: boolean;
    setIsPPTEditingExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const PPTEditingPage: React.FC<PPTEditingPageProps> = ({
    isSidebarExpanded,
    setIsSidebarExpanded,
    isPPTEditingExpanded,
    setIsPPTEditingExpanded,
}) => {

    // State to store the value of the input range
    const [rangeValue, setRangeValue] = useState<number>(60); // Default value is 60%
    const [slideCount, setSlideCount] = useState<number>(8); // Default number of slides
    const [isEditing, setIsEditing] = useState<boolean>(false); // To track if the input is in edit mode

    // Handle the range change via input field
    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = parseInt(e.target.value, 10);
        if (isNaN(newValue)) {
            return; // Exit if the input is not a number
        }

        // Ensure the value stays within the 20% to 500% range
        if (newValue < 20) {
            newValue = 20;
        } else if (newValue > 500) {
            newValue = 500;
        }

        setRangeValue(newValue);
    };

    // Handle when the user clicks on the input to edit it
    const handleClick = () => {
        setIsEditing(true);
    };

    // Handle when the user leaves the input (blur event)
    const handleBlur = () => {
        setIsEditing(false); // Exit edit mode when the user clicks outside
        // Validate and set the value within bounds when exiting edit mode
        if (rangeValue < 20) {
            setRangeValue(20);
        } else if (rangeValue > 500) {
            setRangeValue(500);
        }
    };

    // Handle input change when the user types a custom number
    const handleCustomInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setRangeValue(value);
    };

    // Handle when the user presses the "Enter" key in the input field  
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { // Specify the type here  
        if (e.key === 'Enter') {
            handleRangeChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
        }
    }; 

    // Function to handle number of slides input
    const handleSlideCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSlideCount(Number(event.target.value));
    };

    return (
        <div className="flex h-full w-full flex-col-reverse lg:flex-1 lg:flex-row">
            <Sidebar isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />

            {/* Main Content */}
            <div className='relative flex flex-1 flex-col'>

                {/* PPT Main Content */}
                <div className="relative z-0 flex flex-1 flex-col">

                    <div className={`relative m-5 select-none overflow-auto scrollbar ${isPPTEditingExpanded ? 'min-h-[435px] max-h-[435px]' : 'min-h-[561px] max-h-[561px]'}`}>

                        <div className={`lg:p-7 min-h-[451px] ${isPPTEditingExpanded ? 'lg:p-5' : ''}`}>
                            {/* Centered buttons */}
                            <div className="relative flex items-center justify-center gap-3 md:px-3 md:py-2 sm:p-4 mx-auto box-border" style={{ width: `${Math.max(20, Math.min(rangeValue, 500))}%`, minWidth: '20%' }}>
                                <div className="flex content-center items-center gap-4">
                                    <p>Page 1</p>
                                </div>
                                <div className="ml-auto flex items-center z-10 gap-3">
                                    <CommonTooltip text="Duplicate Page" width={97} negativeY={36} negativeLeft={38}>
                                        <div className="hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer">
                                            <FontAwesomeIcon icon={faCopy} fontSize="20px" />
                                        </div>
                                    </CommonTooltip>
                                    <CommonTooltip text="Add Page" width={71} negativeY={36} negativeLeft={22}>
                                        <div className="hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer">
                                            <FileEarmarkPlus size='20px' />
                                        </div>
                                    </CommonTooltip>
                                    <CommonTooltip text="Delete" width={55} negativeY={36} negativeLeft={16}>
                                        <div className="hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer">
                                            <FontAwesomeIcon icon={faTrashCan} fontSize="20px" />
                                        </div>
                                    </CommonTooltip>
                                </div>
                            </div>

                            {/* Centered image that allows overflow */}
                            <div className="relative flex justify-center items-center mx-auto overflow-visible box-border"
                                style={{
                                    width: `${Math.max(20, Math.min(rangeValue, 500))}%`, // Clamp the width between 20% and 500%
                                    height: `${Math.max(20, Math.min(rangeValue, 500))}%`, // Clamp the height between 20% and 500%
                                    minWidth: '20%', // Ensure the minimum size is 20%
                                    maxWidth: '500%', // Ensure the maximum size is 500%
                                    minHeight: '20%', // Ensure the minimum height is 20%
                                    maxHeight: '500%' // Ensure the maximum height is 500%
                                }}>
                                <img src="./src/assets/UserInput/preview.png" className="border-2 rounded box-border w-full h-auto max-w-full max-h-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom PPT Panel */}
                <div className="absolute bottom-0 right-0 z-10 flex flex-col justify-between px-3 pt-3 sm:left-0 bg-gray-50 dark:bg-zinc-950">

                    {/* Bottom PPT Preview  */}
                    <div className={`flex-2 ${isPPTEditingExpanded ? 'h-30' : 'h-0'}`}>

                        {/* Open/Close Button */}
                        <div className=" flex items-center justify-center w-fit">
                            <Button className="absolute transform p-0.5 left-1/2 rounded-t-full bg-gray-50 hover:bg-gray-50 text-black dark:bg-zinc-950 dark:hover:bg-zinc-950 h-6 w-20 -top-4 z-10 dark:text-white transition-all duration-0" onClick={() => setIsPPTEditingExpanded((prevState) => !prevState)}>
                                {isPPTEditingExpanded ? (
                                    <CommonTooltip text="Close" negativeY={33} negativeLeft={13}>
                                        <FontAwesomeIcon icon={faChevronDown} fontSize="20px" />
                                    </CommonTooltip>
                                ) : (
                                    <CommonTooltip text="Open" negativeY={33} negativeLeft={13}>
                                        <FontAwesomeIcon icon={faChevronUp} fontSize="20px" />
                                    </CommonTooltip>
                                )}
                            </Button>
                        </div>

                        {/* PPT Preview */}
                        <div className={`${isPPTEditingExpanded ? 'visible' : 'invisible'}`}>
                            <div className={`flex flex-col w-full rounded:flex-auto lg:rounded-none ${isPPTEditingExpanded ? '' : 'h-0'}`}>
                                <div className="flex items-center overflow-x-auto overflow-y-hidden scrollbar">

                                    <div className="flex pb-1">
                                        <div className="flex w-full">
                                            {Array.from({ length: slideCount }).map((_, index) => (
                                                <div key={index} className={`flex ${index !== 0 && index !== slideCount - 0 ? 'mx-3' : ''} sm:mr-0`}
                                                >
                                                    <div className="flex h-fit w-auto shrink-0 cursor-pointer items-center rounded relative">
                                                        <span className="absolute bottom-2 left-2 z-10 flex items-center justify-center rounded text-sm font-semibold text-Lato w-6 h-6 bg-blue-700">
                                                            {index + 1}
                                                        </span>
                                                        <div className="relative flex h-full w-full items-center justify-center z-0 overflow-hidden rounded">
                                                            <div className="flex">
                                                                <div className="flex flex-row w-full">
                                                                    <div className="flex flex-row">
                                                                        <div className="h-fit w-44 overflow-hidden contain-layout">
                                                                            <img src="./src/assets/Landing/features1.webp" alt={`Slide ${index + 1}`} className="border-2 rounded md:h-28 md:w-44" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add New Page Button */}
                                        <div className="flex items-center justify-center my-auto h-28 w-20 rounded overflow-hidden contain-layout ml-2 bg-slate-100 dark:bg-slate-800 cursor-pointer">
                                            <FontAwesomeIcon icon={faPlus} fontSize="30px" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Control Button */}
                    <div className="flex flex-row items-center justify-between h-10 z-20 gap-2 w-full my-2">

                        {/* Open/Close Button */}
                        <div className="flex">
                            <Button variant='ghost' onClick={() => setIsPPTEditingExpanded((prevState) => !prevState)}>
                                <FilesAlt size='20px' />
                                <span className="px-2">Pages:</span>
                                <span>{slideCount}</span>
                            </Button>
                        </div>

                        {/* Size Control Bar */}
                        <div className="flex items-center rounded px-4 mr-3 text-sm h-10 w-56">
                            {/* Input range container */}
                            <div className="flex items-center">
                                {/* Input Range */}
                                <div className="flex items-center">
                                    {/* Range Slider */}
                                    <input type="range" min="20" max="500" value={rangeValue} onChange={handleRangeChange} className="h-1.5 appearance-none rounded-lg focus:outline-none bg-blue-500 cursor-ew-resize" />

                                    {/* Custom Input Field */}
                                    <input type={isEditing ? 'number' : 'text'} // Switch between number and text input
                                        value={rangeValue + (isEditing ? '' : '%')} // Show "%" when not editing
                                        onClick={handleClick} // Start editing on click
                                        onBlur={handleBlur} // Stop editing when focus is lost
                                        onChange={handleCustomInput} // Handle the custom number input
                                        onKeyPress={handleKeyPress}  // Trigger on 'Enter' key press
                                        min={20}
                                        max={500}
                                        className="w-14 p-2 mx-2 bg-inherit hover:bg-slate-100 dark:hover:bg-slate-800 rounded dark:text-white focus:outline-none focus:border text-center text-Lato"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default PPTEditingPage;