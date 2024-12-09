import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import MainLayout from './components/Navigation/MainLayout';
import LandingPage from './components/Presentation/LandingPage';
import CreatePresentation from './components/Presentation/CreatePresentation';
import PPTEditingPage from './components/Presentation/PPTEditingPage';
import SignUpPage from './components/UserAccess/SignUpPage';
import LogInPage from './components/UserAccess/LogInPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isPPTEditingExpanded, setIsPPTEditingExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Toggle bar icon
  const toggleBarIcon = () => {
    setIsOpen(!isOpen);
  }

  // Toggle dark mode
  const toggleIcon = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Detect system dark/light mode and set the initial theme
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const setInitialTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      const isSystemDark = e.matches;
      if (isSystemDark) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      }
      else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Set theme on initial load
    setInitialTheme(darkModeQuery);

    // Add event listener for system theme changes
    darkModeQuery.addEventListener('change', setInitialTheme);

    // Cleanup event listener on component unmount
    return () => {
      darkModeQuery.removeEventListener('change', setInitialTheme);
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <MainLayout isDarkMode={isDarkMode} toggleIcon={toggleIcon} isOpen={isOpen} toggleBarIcon={toggleBarIcon} setIsOpen={setIsOpen}>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route
              path='/create-presentation'
              element={<CreatePresentation />}
            />
            <Route
              path='/ppt-editing'
              element={
                <PPTEditingPage
                  isSidebarExpanded={isSidebarExpanded}
                  setIsSidebarExpanded={setIsSidebarExpanded}
                  isPPTEditingExpanded={isPPTEditingExpanded}
                  setIsPPTEditingExpanded={setIsPPTEditingExpanded}
                />
              }
            />
            <Route
              path='/signup'
              element={<SignUpPage />}
            />
            <Route
              path='/login'
              element={<LogInPage />}
            />
          </Routes>
        </MainLayout >
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;