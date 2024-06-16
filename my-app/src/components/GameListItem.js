/**
 * GameListItem.js
 * This component displays the game listings
 */

import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { getDocument, setDocument, deleteDocument, getCollectionIds, subscribeToCollection } from '../proxies/queries.js';
import LoadingSpinner from './LoadingSpinner.js';
import { doc } from '@firebase/firestore';

/**
 * GameListItem component.
 * Renders a single game listing.
 * 
 * @component
 * @param {Object} game - The game object.
 * @returns {React.JSX.Element} The rendered GameListItem component.
 */
export const GameListItem = ({ game, setGamePlayers, setCurrentGame }) => {
    const navigate = useNavigate();
    const { uid } = useAuth();
    const { gameId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState('');
    const [userIsJoined, setUserIsJoined] = useState(false);

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
    }, [gameId]);

    const handleSnapshot = (snapshot) => {
        const players = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Players: " + players + " UID: " + uid );  
        setPlayers(players);
        game.id === gameId && setGamePlayers(players);
        setIsLoading(false);
        setUserIsJoined(isUserJoined(uid));
    }

    // useEffect(() => {
    //     try {
    //         console.log('call');
    //         setIsLoading(true);
    //         return subscribeToDocument(['games', gameId], handleGameSnapshot);
    //     }
    //     catch (error) {
    //         console.error("Error getting game: ", error);
    //         setError("An error occurred. Please try again.");
    //     }
    //     finally {
    //         setIsLoading(false);
    //     }
    // }, [gameId]);

    // const handleGameSnapshot = (snapshot) => {
    //     const game = { id: snapshot.id, ...snapshot.data() };
    //     setGame(game);
    //     game.id === gameId && setCurrentGame(game);
    // }

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

    const isUserJoined = (uid) => {
        return players.some(player => player.id === uid);
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
                <Button variant="primary" onClick={() => joinGame(game.id)} disabled={userIsJoined}>
                    Join
                </Button>
                <Button variant="secondary" onClick={() => leaveGame(game.id)} disabled={!userIsJoined}>
                    {players?.length !== 1 ? 'Leave' : 'Delete'}
                </Button>
            </div>
            
        </li>
    );
};
