/**
 * @file        GamesCard.js
 * @description This file defines a container component for CreateGameForm and the list of games.
 * @author      Johnathan Glasgow
 * @date        18/06/2024
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { subscribeToCollection } from '../proxies/queries.js';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Collapse } from 'react-bootstrap';
import { GameListItem } from './GameListItem.js';
import { CreateGameForm } from './CreateGameForm.js';
import LoadingSpinner from './LoadingSpinner.js';

/**
 * GamesCard component.
 * Renders a card with a list of games.
 * 
 * @component
 * @returns {React.JSX.Element} The rendered GamesCard component.
 */
export function GamesCard({ setGamePlayers, setCurrentGame }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { gameId } = useParams();
    const [games, setGames] = useState([]);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(!gameId);
    const [isLoading, setIsLoading] = useState(false);

    // Subscribe to the games collection
    useEffect(() => {
        try {
            setIsLoading(true);
            return subscribeToCollection(['games'], handleSnapshot);
        }
        catch (error) {
            console.error("Error getting games: ", error);
            setError("An error occurred. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    }, [gameId]);

    /**
     * Handle the snapshot of the games collection.
     * 
     * @param {Object} snapshot - An object representing a snapshot from the database.
     */
    const handleSnapshot = (snapshot) => {
        const games = snapshot.docs.map((doc) => {
            if (doc.id === gameId) {
                setCurrentGame({ id: doc.id, ...doc.data() });
            }
            return { id: doc.id, ...doc.data() };
        });
        setGames(games);
        setIsLoading(false);
    }

    return (
        <Card className='game-card'>
            <LoadingSpinner show={isLoading} />
            <Card.Body>
                <Card.Title>Games
                    <Button
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                        className="btn btn-link"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        {open ? '▲' : '▼'}
                    </Button>
                </Card.Title>
                <Collapse in={open}>
                    <div id="game-collapse">
                        <Card.Subtitle>Create a new game:</Card.Subtitle>
                        <CreateGameForm />
                        {error && <Alert variant="danger">{error}</Alert>}
                        {
                            // If there are no games, display nothing, otherwise display the list of games
                            !games ? '' :
                                <>
                                    <Card.Subtitle>Available Games <span style={{ fontStyle: 'italic' }}>(click the name to navigate to the game page)</span>:</Card.Subtitle>
                                    <ul className='games-list'>
                                        {
                                            games.map((game) => (
                                                <GameListItem key={game.id} game={game} setGamePlayers={setGamePlayers} />
                                            ))
                                        }
                                    </ul>
                                </>
                        }
                        {gameId && <p onClick={() => navigate(`/user/${user.uid}`)} style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline', fontStyle: 'italic' }}>Back to user page</p>}
                    </div>

                </Collapse>
            </Card.Body>
        </Card>
    );
}