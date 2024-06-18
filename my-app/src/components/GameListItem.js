/**
 * @file        GameListItem.js
 * @description This file defines a component that represents a single game listing in the GamesCard component.
 * @author      Johnathan Glasgow
 * @date        14/06/2024
 */

import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { setDocument, deleteDocument, subscribeToCollection } from '../proxies/queries.js';
import LoadingSpinner from './LoadingSpinner.js';

/**
 * GameListItem component.
 * Renders a single game listing.
 * 
 * @component
 * @param {Object} game - The game object.
 * @returns {React.JSX.Element} The rendered GameListItem component.
 */
export const GameListItem = ({ game, setGamePlayers }) => {
    const navigate = useNavigate();
    const { uid, userName } = useAuth();
    const { gameId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState('');

    const MAX_PLAYERS = 5;
    const isUserJoined = (uid) => players.some(player => player.id === uid);

    // Subscribe to the players collection
    useEffect(() => {
        try {
            setIsLoading(true);
            return subscribeToCollection(['games', game.id, 'players'], handleSnapshot);
        }
        catch (error) {
            console.error("Error getting players: ", error);
            setError("An error occurred. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    }, [game, gameId]);

    /**
     * Handle the snapshot of the players collection.
     * 
     * @param {Object} snapshot - An object representing a snapshot from the database.
     */
    const handleSnapshot = (snapshot) => {
        const players = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPlayers(players);
        // If the game id matches the gameId in the URL, set the players as the current game players
        game.id === gameId && setGamePlayers(players);
        setIsLoading(false);
    }

    /**
     * Join a game.
     * 
     * @param {string} gameToJoinId - The ID of the game to join.
     * @returns {Promise<void>} A promise that resolves when the user has joined the game.
     */
    const joinGame = async (gameToJoinId) => {
        setIsLoading(true);
        const playerPath = ['games', gameToJoinId, 'players', uid];

        try {
            // Add the player to the game in the database           
            await setDocument(playerPath, { name: userName, hasSwapped: false });
            // If there is no gameId in the URL, navigate to the game
            !gameId && navigate(`/games/${gameToJoinId}`);
        }
        catch (error) {
            console.error("Error joining game: ", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    /**
     * Leave a game.
     * 
     * @param {string} gameId - The ID of the game to leave.
     * @returns {Promise<void>} A promise that resolves when the user has left the game.
     */
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

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
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
                {/* Disable join button if game has started, user has already joined, or max players has been reached */}
                <Button variant="primary" onClick={() => joinGame(game.id)} disabled={game.gameStarted || isUserJoined(uid) || players.length === MAX_PLAYERS}>
                    Join
                </Button>
                {/* Disable leave button if user has not joined. If user is the only player, change button function to delete game */}
                <Button variant="secondary" onClick={() => leaveGame(game.id)} disabled={!isUserJoined(uid)}>
                    {players?.length !== 1 ? 'Leave' : 'Delete'}
                </Button>
            </div>
        </li>
    );
};
