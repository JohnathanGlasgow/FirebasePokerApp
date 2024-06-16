/**
 * GameListItem.js
 * This component is for managing games
 */

import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { subscribeToCollection } from '../proxies/queries.js';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Collapse } from 'react-bootstrap';
import { GameListItem } from './GameListItem.js';
import { CreateGameForm } from './CreateGameForm.js'; 
import LoadingSpinner from './LoadingSpinner.js';   

export default function GamesCard({ setGamePlayers, setCurrentGame }) {
    const navigate = useNavigate();
    const { user, uid } = useAuth();
    const { gameId } = useParams();
    const [games, setGames] = useState([]);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(!gameId);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        try {
            console.log("Getting games...");
            setIsLoading(true);
            return subscribeToCollection(['games'], handleSnapshot);
        }
        catch (error) {
            console.error("Error getting games: ", error);
            setError("An error occurred. Please try again.");
        }
        finally {
            console.log("Done getting games.");
            setIsLoading(false);
        }
    }, [gameId]);

    const handleSnapshot = (snapshot) => {
        const games = snapshot.docs.map((doc) => {
            console.log("Doc ID: " + doc.id + " Game ID: " + gameId);
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
                        style={{ textDecoration: 'none', color: 'white'}}
                    >
                        {open ? '▲' : '▼'}
                    </Button>
                </Card.Title>
                <Collapse in={open}>
                    <div id="game-collapse">
                        <Card.Subtitle>Create a new game:</Card.Subtitle>
                        <CreateGameForm />
                        {error && <Alert variant="danger">{error}</Alert>}
                        {!games ?
                            ''
                            :
                            <>
                                <Card.Subtitle>Available Games <span style={{fontStyle: 'italic'}}>(click the name to navigate to the game page)</span>:</Card.Subtitle>
                                <ul className='games-list'>
                                    {
                                        games.map((game) => (
                                            <GameListItem key={game.id} game={game} setGamePlayers={setGamePlayers} />
                                        ))
                                    }
                                </ul>
                            </>
                        }
                        {gameId && <p onClick={() => navigate(`/user/${user.uid}`)} style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline', fontStyle: 'italic'}}>Back to user page</p>}
                    </div>

                </Collapse>
            </Card.Body>
        </Card>
    );
}