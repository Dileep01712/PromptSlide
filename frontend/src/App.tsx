import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar.tsx';
import MainContent from './components/MainContent.tsx';
import ChatInput from './components/ChatInput.tsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        {/* <MainContent /> */}
      </div>
      {/* <ChatInput /> */}
    </div>
  );
}

export default App;