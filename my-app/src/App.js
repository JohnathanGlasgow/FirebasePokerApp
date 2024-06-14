import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import TodoList from './components/TodoList.js';
import LoginModal from './components/auth/LoginModal';
import UserCard from './components/auth/UserCard.js';
import { Route, Routes, Navigate } from 'react-router-dom';
import GroupsCard from './components/GroupsCard.js';
import GroupPage from './components/GroupPage.js';

/**
 * App component for the application.
 * 
 * @returns {React.JSX.Element} The App component.
 */
function App() {

  return (

    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/user/:userId" element={
          <>
            <UserCard />
            <GroupsCard />
            <TodoList />
          </>
        } />
        <Route path="/groups/:groupId" element={
          <>
            <UserCard />
            <GroupsCard />
            <GroupPage />
          </>
        } />
      </Routes>
    </div>

  );
}

export default App;