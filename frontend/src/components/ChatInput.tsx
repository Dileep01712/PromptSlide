import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';

const ChatInput: React.FC = () => {
    return (
        <div className="flex flex-wrap items-center p-2.5 z-10 absolute bottom-2.5 chat-input">
            <button className="outline-none upload-button">
                <FontAwesomeIcon icon={faPaperclip} fontSize={"20px"} />
            </button>
            <textarea className="p-1 min-w-0 border-none outline-none resize-none overflow-y-auto flex-auto" placeholder="Type a message..."></textarea>
            <button className="outline-none send-button">
                <FontAwesomeIcon icon={faPaperPlane} fontSize={"20px"} />
            </button>
        </div>
    );
}

export default ChatInput;
