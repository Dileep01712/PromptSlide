import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ChatInput from './components/ChatInput';
import './App.css';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  return (
    <div className={`flex flex-col ${isLargeScreen ? 'min-h-lvh' : 'h-dvh'}`}>
      <Navbar isLargeScreen={isLargeScreen} setIsLargeScreen={setIsLargeScreen} />
      <div className="flex flex-grow">
        <Sidebar isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} isLargeScreen={isLargeScreen} setIsLargeScreen={setIsLargeScreen} />
        <MainContent isSidebarExpanded={isSidebarExpanded} isLargeScreen={isLargeScreen} />
      </div>
        <ChatInput isSidebarExpanded={isSidebarExpanded} isLargeScreen={isLargeScreen} />
    </div>
  );
}

export default App;
