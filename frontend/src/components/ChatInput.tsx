import React, { useRef, useState, ChangeEvent } from 'react';
import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ChatInputProps {
    isSidebarExpanded: boolean;
    isLargeScreen: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ isSidebarExpanded, isLargeScreen }) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [value, setValue] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            // Reset height to auto to calculate scrollHeight
            textarea.style.height = 'auto';
            // Set height to the smaller of scrollHeight or maxHeight
            textarea.style.height = `${Math.min(textarea.scrollHeight, parseFloat('192'))}px`;
        }
    };

    return (
        <div className={`grid grid-cols-[auto,1fr,auto] gap-0 justify-center items-center bg-inputColor text-textColor p-1.5  bottom-2.5 rounded-3xl ${isSidebarExpanded ? 'lg:translate-x-2/3' : 'lg:translate-x-1/2'} ${isLargeScreen ? 'translate-x-0' : 'translate-x-0'} ${isLargeScreen ? 'w-1/2' : 'w-11/12'} ${isLargeScreen ? 'ml-[0%]' : 'ml-[4%]'}`}>
            <button className="outline-none m-1 p-1.5 self-end">
                <FontAwesomeIcon icon={faPaperclip} fontSize={"21px"} />
            </button>

            <div className={`flex p-1 pl-2 h-full ${isLargeScreen ? 'w-full' : 'w-11/12'}`}>
                <textarea className="w-full pt-1 resize-none focus:outline-none overflow-y-auto scrollbar bg-transparent" rows={1} placeholder="Type a message..." ref={textareaRef} value={value} onChange={handleChange}></textarea>
            </div>

            <button className="outline-none m-1 p-1.5 self-end">
                <FontAwesomeIcon icon={faPaperPlane} fontSize={"21px"} />
            </button>
        </div>
    );
}

export default ChatInput;