import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import MainLayout from './components/Navigation/MainLayout';
import LandingPage from './components/Presentation/LandingPage';
import CreatePresentation from './components/Presentation/CreatePresentation';
import SignUpPage from './components/UserAccess/SignUpPage';
import LogInPage from './components/UserAccess/LogInPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PPTViewerPage from './components/Presentation/PPTViewerPage';
import { AuthProvider } from './components/context/AuthProvider';
import { AccessProvider } from './components/context/AccessProvider';
import ProtectedRoute from './components/Navigation/ProtectedRoute';

const App: React.FC = () => {
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

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    console.log("VITE_GOOGLE_CLIENT_ID is missing in environment variables!");
    return null
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <AccessProvider>
          <Router>
            <MainLayout
              isDarkMode={isDarkMode}
              toggleIcon={toggleIcon}
              isOpen={isOpen}
              toggleBarIcon={toggleBarIcon}
              setIsOpen={setIsOpen}
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/user_input" element={<CreatePresentation />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LogInPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/ppt_viewer" element={<PPTViewerPage />} />
                </Route>
              </Routes>
            </MainLayout>
          </Router>
        </AccessProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;