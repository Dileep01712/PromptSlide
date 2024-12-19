import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faChevronDown, faChevronUp, faCopy, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Files, FilesAlt } from "react-bootstrap-icons";
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
    const dropdownRef = useRef<HTMLDivElement>(null);
    const targetDivRef = useRef<HTMLDivElement>(null);
    const [previewVisible, setPreviewVisible] = useState(true);
    const isMobile = window.innerWidth <= 768;
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
    const carouselRef = useRef<HTMLDivElement | null>(null);

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


    const handleSlideCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSlideCount(Number(event.target.value));
    };
    handleSlideCountChange;

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            targetDivRef.current &&
            targetDivRef.current.contains(event.target as Node)
        ) {
            setPreviewVisible(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleImageClick = (index: number) => {
        setActiveImageIndex(index);
    }

    const goToNextImage = () => {
        if (activeImageIndex < slideCount - 1) {
            setActiveImageIndex((prevIndex) => prevIndex + 1)
        }
    };

    const goToPreviousImage = () => {
        if (activeImageIndex > 0) {
            setActiveImageIndex((prevIndex) => prevIndex - 1)
        }
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel || activeImageIndex < 0 || activeImageIndex >= carousel.children.length) return;

        const activeImage = carousel.children[activeImageIndex] as HTMLElement;
        const slideMargin =
            parseFloat(window.getComputedStyle(activeImage).marginRight || "0") +
            parseFloat(window.getComputedStyle(activeImage).marginLeft || "0");

        const offset = Math.max(0, Math.min(activeImage.offsetLeft - carousel.offsetWidth / 2 + activeImage.offsetWidth / 2 + slideMargin - 19, carousel.scrollWidth - carousel.offsetWidth));

        carousel.scrollTo({ left: offset, behavior: 'smooth' });
    }, [activeImageIndex]);

    return (
        <div className="flex lg:h-full w-full flex-col-reverse lg:flex-1 lg:flex-row overflow-hidden" style={{ height: 'var(--content-height)'}}> {/* For Small Screen */}
            <Sidebar isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />

            {/* Main Content */}
            <div className='relative flex flex-1 flex-col' ref={targetDivRef}>

                {/* Large Screen: PPT Main Content */}
                <div className="relative flex flex-col">

                    <div className={`relative md:m-5 m-4 select-none overflow-auto scrollbar ${isPPTEditingExpanded ? 'md:min-h-[574px] md:max-h-[574px]' : 'md:min-h-[574px] md:max-h-[574px]'}`}>

                        <div className={`lg:p-7 md:min-h-[500px] min-h-[360px] flex flex-col items-center justify-center overflow-auto ${isPPTEditingExpanded ? 'lg:p-5' : ''}`}>
                            {/* Centered buttons */}
                            <div className="relative flex items-center justify-center mx-auto gap-3 px-3 pt-2 pb-1" style={{
                                width: `${Math.max(20, Math.min(rangeValue, 500) + (window.innerWidth < 768 ? 38 : window.innerWidth < 900
                                    ? 20 : 0))}%`, minWidth: '20%'
                            }}>
                                <div className="flex content-center items-center gap-4">
                                    <p>Page 1</p>
                                </div>
                                <div className="ml-auto flex items-center z-10 gap-3">
                                    <CommonTooltip text="Duplicate" width={65} negativeY={36} negativeLeft={23}>
                                        <div className="hover:bg-gray-100 dark:hover:bg-zinc-600 rounded p-1 cursor-pointer">
                                            <FontAwesomeIcon icon={faCopy} fontSize="20px" />
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
                            <div className="relative flex items-center justify-center mx-auto overflow-visible border-2 rounded-md"
                                style={{
                                    width: `${Math.max(20, Math.min(rangeValue, 500) + (window.innerWidth < 768 ? 38 : window.innerWidth < 900 ? 20 : 0))}%`, // Clamp the width between 20% and 500%
                                    height: `${Math.max(20, Math.min(rangeValue, 500))}%`, // Clamp the height between 20% and 500%
                                    minWidth: '20%', // Ensure the minimum size is 20%
                                    maxWidth: '500%', // Ensure the maximum size is 500%
                                    minHeight: '20%', // Ensure the minimum height is 20%
                                    maxHeight: '500%' // Ensure the maximum height is 500%
                                }}>
                                <img src="./assets/UserInput/preview.png" className="rounded w-full max-w-full" />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Bottom PPT Panel */}
                <div className={`flex absolute bottom-0 md:right-0 md:left-0 flex-col justify-between md:px-3 px-2 md:pt-3 pt-2 md:h-auto md:w-auto h-auto w-full rounded-t-2xl ${previewVisible ? "bg-gray-300 dark:bg-zinc-900" : "bg-transparent"}`} ref={dropdownRef}>

                    {/* For Small Screens */}
                    {isMobile ? (
                        <>
                            {previewVisible ? (
                                // Small Screen: PPT Preview
                                <>
                                    <div className="flex py-2 select-none">
                                        <div>
                                            <Button variant='ghost' className="hover:bg-transparent relative h-5 w-20 -bottom-0.5">
                                                <FontAwesomeIcon icon={faPlus} fontSize="12px" className="mx-1.5 font-bold" />
                                                <span className="text-xs font-bold">New page</span>
                                            </Button>
                                        </div>
                                        <div>
                                            <Button variant='ghost' className="hover:bg-transparent relative h-5 w-20 -bottom-0.5" onClick={goToPreviousImage} disabled={activeImageIndex === 0}>
                                                <FontAwesomeIcon icon={faAngleLeft} fontSize="12px" className="mx-1.5 font-bold" />
                                                <span className="text-xs font-bold">Move left</span>
                                            </Button>
                                        </div>
                                        <div>
                                            <Button variant='ghost' className="hover:bg-transparent h-5 w-20 relative -bottom-0.5" onClick={goToNextImage} disabled={activeImageIndex === slideCount - 1}>
                                                <FontAwesomeIcon icon={faAngleRight} fontSize="12px" className="mx-1.5 font-bold" />
                                                <span className="text-xs font-bold">Move right</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center select-none">
                                        <div className="flex w-full overflow-x-hidden">
                                            <div className="flex pb-1 w-full overflow-x-auto overflow-y-hidden scrollbar" ref={carouselRef}>
                                                {Array.from({ length: slideCount }).map((_, index) => (
                                                    <div key={index} className={`flex ${index !== 0 && index !== slideCount - 0 ? 'ml-3' : ''} sm:mr-0`}>
                                                        <div className="flex h-fit w-auto shrink-0 cursor-pointer items-center rounded relative">
                                                            <span className={`absolute bottom-2 left-2 z-10 flex items-center justify-center rounded text-sm font-semibold w-5 h-5 ${activeImageIndex === index ? 'bg-purple-500' : 'bg-gray-400'}`}>
                                                                {index + 1}
                                                            </span>
                                                            <div className="relative flex h-full w-full items-center justify-center z-0 overflow-hidden rounded">
                                                                <div className="flex">
                                                                    <div className="flex flex-row w-full">
                                                                        <div className="flex flex-row">
                                                                            <div className={`h-fit md:w-44 w-36 overflow-hidden contain-layout rounded ${activeImageIndex === index ? 'border-2 border-purple-500' : 'border-2 border-transparent'}`} onClick={() => handleImageClick(index)}>
                                                                                <img src="./assets/Landing/features1.webp" alt={`Slide ${index + 1}`} className="md:h-28 md:w-44 w-auto" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Add New Page Button */}
                                                <div className="flex items-center justify-center my-auto h-[97px] border-2 md:w-20 w-14 rounded overflow-hidden contain-layout ml-2 bg-slate-100 dark:bg-slate-800 cursor-pointer shrink-0">
                                                    <FontAwesomeIcon icon={faPlus} className="h-7" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Open/Close Button
                                <div className="flex mb-2 w-fit ml-auto mr-1.5">
                                    <Button variant="ghost" onClick={() => { setPreviewVisible((prev) => !prev); setIsPPTEditingExpanded((prevState) => !prevState); }}>
                                        <div className="relative flex items-center justify-center">
                                            <Files size="27px" />
                                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -ml-[1px] mt-[1px]">
                                                {slideCount}
                                            </span>
                                        </div>
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Bottom PPT Panel */}
                            <div className=" lg:flex absolute bottom-0 md:right-0 md:left-0 z-10 flex-col justify-between md:px-3 px-2 md:pt-3 pt-2 bg-gray-50 dark:bg-zinc-900 md:h-auto md:w-auto h-auto w-full">

                                {/* Bottom PPT Preview  */}
                                <div className={`transition-all duration-500 ${isPPTEditingExpanded ? 'h-32' : 'h-0'}`}>

                                    {/* Open/Close Button */}
                                    <div className="hidden md:flex items-center justify-center w-fit">
                                        <Button className="absolute transform p-0.5 left-1/2 rounded-t-full bg-gray-50 hover:bg-gray-50 text-black dark:bg-zinc-900 dark:hover:bg-zinc-900 h-6 w-20 -top-4 z-10 dark:text-white transition-all duration-0" onClick={() => setIsPPTEditingExpanded((prevState) => !prevState)}>
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

                                    {/* Large Screen: PPT Preview */}
                                    <div className={`${isPPTEditingExpanded ? 'duration-500 visible' : 'opacity-0 duration-500 invisible'}`}>
                                        <div className={`flex flex-col w-full rounded:flex-auto lg:rounded-none ${isPPTEditingExpanded ? '' : 'h-0'}`}>

                                            <div className="flex items-center select-none">
                                                <div className="flex w-full overflow-x-hidden">
                                                    <div className="flex w-full pb-1 overflow-x-auto overflow-y-hidden scrollbar" ref={carouselRef}>
                                                        {Array.from({ length: slideCount }).map((_, index) => (
                                                            <div key={index} className={`flex sm:mr-0 ${index !== 0 && index !== slideCount - 0 ? 'ml-3' : ''}`}>
                                                                <div className="flex h-fit w-auto shrink-0 cursor-pointer items-center rounded relative">
                                                                    <span className={`absolute bottom-2 left-2 z-10 flex items-center justify-center rounded text-sm font-semibold w-5 h-5 ${activeImageIndex === index ? 'bg-purple-500' : 'bg-gray-400'}`}>
                                                                        {index + 1}
                                                                    </span>
                                                                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded">
                                                                        <div className="flex">
                                                                            <div className="flex flex-row w-full">
                                                                                <div className="flex flex-row">
                                                                                    <div className={`h-fit md:w-44 w-36 overflow-hidden contain-layout rounded-md ${activeImageIndex === index ? 'border-2 border-purple-500' : 'border-2 border-transparent'}`} onClick={() => handleImageClick(index)}>
                                                                                        <img src="./assets/Landing/features1.webp" alt={`Slide ${index + 1}`} className="rounded md:h-28 md:w-44 w-auto" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* Add New Page Button */}
                                                        <div className="flex items-center justify-center my-auto md:h-28 h-[97px] border-2 md:w-20 w-18 rounded overflow-hidden contain-layout ml-2 bg-slate-100 dark:bg-slate-800 cursor-pointer shrink-0">
                                                            <FontAwesomeIcon icon={faPlus} className="h-7" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Control Button */}
                                <div className="hidden lg:flex flex-row items-center justify-between h-10 z-20 gap-2 w-full my-2">

                                    {/* Open/Close Button */}
                                    <div className="flex">
                                        <Button variant='ghost' onClick={() => setIsPPTEditingExpanded((prevState) => !prevState)}>
                                            <FilesAlt size='20px' />
                                            <span className="px-2">Pages:</span>
                                            <span>{slideCount}</span>
                                        </Button>
                                    </div>

                                    {/* Size Control Bar */}
                                    <div className="hidden lg:flex items-center rounded px-4 mr-3 text-sm h-10 w-56">
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
                                                    className="w-14 p-2 mx-2 bg-slate-100 dark:bg-slate-800 rounded dark:text-white focus:outline-none focus:border text-center select-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PPTEditingPage;