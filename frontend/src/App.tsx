import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './components/MainLayout';
import LandingPage from './components/LandingPage';
import CreatePresentation from './components/CreatePresentation';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route
            path='/create-presentation'
            element={<CreatePresentation />}
          />
        </Routes>
      </MainLayout >
    </Router>
  );
};

export default App;