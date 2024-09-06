import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './components/MainLayout';
import LandingPage from './components/LandingPage';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </MainLayout >
    </Router>
  );
};

export default App;