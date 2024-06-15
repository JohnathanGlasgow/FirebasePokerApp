/**
 * GamePage.js
 * 
 * This component displays the game page.
 */


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { subscribeToDocument } from '../proxies/queries';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

/**
 * GamePage component.
 * Shows the todo list for a game if the user is a member of the game.
 * 
 * @component
 * @returns {React.JSX.Element} The rendered GamePage component.
 */
export default function GamePage() {
    const { uid  } = useAuth();
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            setIsLoading(true);
            return subscribeToDocument(['games', gameId], handleSnapshot);
        }
        catch (error) {
            console.error("Error getting game: ", error);
            setError("An error occurred. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    }, [game?.members]);

    const handleSnapshot = (snapshot) => {
        if (snapshot.exists()) {
            setGame({ id: snapshot.id, ...snapshot.data() });
        } else {
            setError('No such game exists.');
        }
    }


    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!game) {
        return <Alert variant="info">Loading...</Alert>;
    }

    if (uid && !game.members?.includes(uid)) {
        return <Alert variant="danger">{`You are not a member of ${game.name}`}</Alert>;
    }
    return (
        <>
             
        </>
    );
}

