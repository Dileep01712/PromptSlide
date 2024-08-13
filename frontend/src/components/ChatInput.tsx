import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ChatInputProps {
    isSidebarExpanded: boolean;
    isLargeScreen: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ isSidebarExpanded, isLargeScreen }) => {
    return (
        <div className={`flex flex-grow-0 justify-center items-center bg-inputColor text-textColor p-1.5 absolute bottom-3 rounded-3xl ${isSidebarExpanded ? 'translate-x-2/3' : 'translate-x-1/2'} ${isLargeScreen ? '' : 'translate-x-0'} ${isLargeScreen ? 'w-1/2' : 'w-11/12'}`}>
            <button className="outline-none m-1 p-1.5 rounded-xl self-end">
                <FontAwesomeIcon icon={faPaperclip} fontSize={"21px"} />
            </button>
            <div className={`flex p-1 ${isLargeScreen ? 'w-full' : 'w-11/12'}`}>
                <textarea className="w-full min-h-[20px] resize-none focus:outline-none overflow-y-auto scrollbar bg-transparent pl-2 pr-2" rows={1} placeholder="Type a message..."></textarea>
            </div>
            <button className="outline-none m-1 p-1.5 rounded-xl self-end">
                <FontAwesomeIcon icon={faPaperPlane} fontSize={"21px"} />
            </button>
        </div>
    );
}

export default ChatInput;
