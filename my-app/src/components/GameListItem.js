/**
 * GameListItem.js
 * This component displays the game listings
 */

import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { getDocument, setDocument, deleteDocument, getCollectionIds, subscribeToCollection } from '../proxies/queries.js';
import LoadingSpinner from './LoadingSpinner.js';

/**
 * GameListItem component.
 * Renders a single game listing.
 * 
 * @component
 * @param {Object} game - The game object.
 * @returns {React.JSX.Element} The rendered GameListItem component.
 */
export const GameListItem = ({ game }) => {
    const navigate = useNavigate();
    const { uid } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            console.log("Getting players...");
            setIsLoading(true);
            return subscribeToCollection(['games', game.id, 'players'], handleSnapshot);
        }
        catch (error) {
            console.error("Error getting players: ", error);
            setError("An error occurred. Please try again.");
        }
        finally {
            console.log("Done getting players.");
            setIsLoading(false);
        }
    }, []);

    const handleSnapshot = (snapshot) => {
        const players = snapshot.docs.map(doc => doc.id);
        console.log("Players: " + players + " UID: " + uid );  
        setPlayers(players);
        setIsLoading(false);
    }

    const getPlayers = async (gamePath) => {
        const playerIds = await getCollectionIds([...gamePath, 'players']);
        return playerIds || [];
    }

    const joinGame = async (gameId) => {
        setIsLoading(true);
        const playerPath = ['games', gameId, 'players', uid];
        
        try {           
            await setDocument(playerPath, {});
        }
        catch (error) {
            console.error("Error joining game: ", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const leaveGame = async (gameId) => {
        setIsLoading(true);
        const gamePath = ['games', gameId];
        const playerPath = [...gamePath, 'players', uid];
        try {          
            players?.length > 1 ? await deleteDocument(playerPath) : await deleteDocument(gamePath);
        }
        catch (error) {
            console.error("Error leaving game: ", error);
        }
        finally {
            setIsLoading(false);
        }
    }

    if (!game) {
        return null;
    }
    
    return (
        <li key={game.id} style={{ listStyleType: 'none', position: 'relative' }} className='games-li'>
            <LoadingSpinner show={isLoading} alt={true} />
            <p
                onClick={() => navigate(`/games/${game.id}`)}
                style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline' }}
            >
                {game.name}
            </p>
            <p>Player Count: {players?.length}</p>
            <div className='button-group'>
                <Button variant="primary" onClick={() => joinGame(game.id)} disabled={players?.includes(uid)}>
                    Join
                </Button>
                <Button variant="secondary" onClick={() => leaveGame(game.id)} disabled={!players?.includes(uid)}>
                    {players?.length !== 1 ? 'Leave' : 'Delete'}
                </Button>
            </div>
            
        </li>
    );
};
