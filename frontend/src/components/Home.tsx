import { useState } from 'react';
import Navbar from './Navbars/Navbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import ChatInput from './ChatInput';

function App() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

    return (
        <div className="css-1wxslj ant-app">
            <div className="chat-gpt-quick-query-container flex h-full w-full pb-5">
                <div className="flex flex-col shrink-0" draggable="false">
                    <Sidebar isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} isLargeScreen={isLargeScreen} setIsLargeScreen={setIsLargeScreen} />
                </div>
                <div className="relative overflow-hidden min-w-0 flex-1">
                    <div className="relative">
                        <Navbar isLargeScreen={isLargeScreen} setIsLargeScreen={setIsLargeScreen} />
                    </div>
                    <div className="contents">
                        <div className='query-chat-panel relative flex flex-col h-fit'>
                            <div className='flex h-full w-full'>
                                <div className="flex flex-col h-full w-full">
                                    <div className="relative">
                                        <MainContent isSidebarExpanded={isSidebarExpanded} isLargeScreen={isLargeScreen} />
                                    </div>
                                    <div>
                                        <ChatInput isSidebarExpanded={isSidebarExpanded} isLargeScreen={isLargeScreen} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
