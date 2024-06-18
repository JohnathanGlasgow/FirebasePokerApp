/**
 * @file        UserCard.js
 * @description This file exports a UserCard component that renders a card with user information.
 *              It displays the user's email if logged in, or "Anonymous" if logged in anonymously.
 * @author      Johnathan Glasgow
 * @date        14/06/2024
 */

import { Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import LogoutButton from './LogoutButton';
import LoadingSpinner from '../LoadingSpinner';

/**
 * UserCard component for the application.
 * 
 * @returns {React.JSX.Element} The UserCard component.
 */
function UserCard() {
  const { authLoading, userName } = useAuth();

  if (authLoading) return <Card className="user-card"> <LoadingSpinner show={true}/> </Card>;
  return (
    <Card className="user-card">
      <Card.Body className='user-card-body'>
        <Card.Title>Logged in as: <span className='user-name'>{userName}</span></Card.Title>
        <LogoutButton />
      </Card.Body>
    </Card>
  );
}

export default UserCard;