import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginModal from './components/auth/LoginModal';
import UserCard from './components/auth/UserCard.js';
import { Route, Routes, Navigate } from 'react-router-dom';
import { GamesCard } from './components/GamesCard.js';
import { GameRoute } from './components/GameRoute.js';

/**
 * App component for the application.
 * 
 * @returns {React.JSX.Element} The App component.
 */
const App = () => {

  return (

    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/user/:userId" element={
          <>
            <UserCard />
            <GamesCard />
          </>
        } />
        <Route path="/games/:gameId" element={
          <>
            <UserCard />
            <GameRoute />
          </>
        } />
      </Routes>
    </div>

  );
}

export default App;