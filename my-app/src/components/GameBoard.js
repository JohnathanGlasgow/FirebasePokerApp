/**
 * @file        GameBoard.js
 * @description This file defines a component that represents a game board for a poker game.
*               This is where the game session occurs and game logic is implemented.
 *              The game board shows the game name, player count, cards remaining, and buttons to start the game, swap cards, and end the turn.
 * @author      Johnathan Glasgow
 * @date        14/06/2024
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setDocument } from '../proxies/queries';
import { Alert, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { PokerHand } from './PokerHand';
import { drawCards, getRemainingCards } from '../api_services/deckQueries';
import { getHandRanking } from '../utilities/evaluateHand';
import LoadingSpinner from './LoadingSpinner.js';

/**
 * GameBoard component.
 * This component is a container for the game board.
 * It renders a card with the game name, player count, cards remaining, and buttons to start the game, swap cards, and end the turn.
 * 
 * @component
 * @param {Object} players - The players in the game (passed in from GamesCard via GameRoute).
 * @param {Object} game - The game object (passed in from GamesCard via GameRoute).
 * @returns {React.JSX.Element} The rendered GamePage component.
 */
export function GameBoard({ players, game }) {
    const { uid, userName } = useAuth();
    const { gameId } = useParams();

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [remainingCards, setRemainingCards] = useState(52);
    const [player, setPlayer] = useState(null);
    const [cardsToSwap, setCardsToSwap] = useState([]);

    const isYourTurn = game.order && game.order[game.turn].id === player?.id;
    const isGameWaiting = game.phase === 0;
    const isGameStarted = game.phase === 1;

    // Find player that matches uid and use to setPlayer
    useEffect(() => {
        players &&
            setPlayer(players.find(player => player?.id === uid));
    }, [players, uid]);

    // Get the amount of remaining cards from deck
    useEffect(() => {
        getRemainingCards(game?.deckId).then((cards) => {
            cards.remaining && setRemainingCards(cards.remaining);
        });
    }, [game]);

    /**
     * This function handles the event when the start game button is clicked.
     * It sets the game phase to 1 and deals cards to each player.
     * 
     * @returns {Promise<void>} - A promise that resolves when the game has started.
     */
    async function handleStartGame() {
        if (game.phase !== 0) { return; }
        deal();
        const newPhase = game.phase + 1;
        // Map name and id from players to new array turnOrder
        // This is used to determine the turn order of the game
        const turnOrder = players.map(player => ({ name: player.name, id: player?.id }));
        await setDocument(['games', gameId], { ...game, phase: newPhase, gameStarted: true, order: turnOrder });
    }

    /**
     * This function deals cards to each player in the game.
     * It draws 5 cards from the deck for each player and sets the player's hand in the database.
     * 
     * @returns {Promise<void>} - A promise that resolves when all players have been dealt cards.
     */
    const deal = async () => {
        setIsLoading(true);
        try {
            await Promise.all(players.map(async player => {
                const cards = await drawCards(game.deckId, 5);
                setRemainingCards(cards.remaining);
                await setDocument(['games', gameId, 'players', player?.id], { hand: cards.cards });
            }));
        } catch (error) {
            console.error(`Error dealing cards: ${error}`);
            setError(`Error dealing cards: ${error}`);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Swap cards in the player's hand based on the indexes in cardsToSwap.
     * 
     * @param {number[]} cardIndexes 
     */
    const swapCards = async (cardIndexes) => {
        setIsLoading(true);
        try {
            const newCards = await drawCards(game.deckId, cardsToSwap.length);
            setRemainingCards(newCards.remaining);

            // Create a copy of the player's hand
            console.log(player.hand);
            const newHand = [...player.hand];

            // Replace the cards at the specified indexes
            cardsToSwap.forEach((index, i) => {
                newHand[index] = newCards.cards[i];
            });

            await setDocument(['games', gameId, 'players', player?.id], { hand: newHand, hasSwapped: true });
        } catch (error) {
            console.error(`Error swapping cards for ${player}: ${error}`);
        } finally {
            setCardsToSwap([]);
            setIsLoading(false);
        }
    }

    /**
     * Evaluate a player's hand and set their rank in the database.
     * 
     * @param {Object} player 
     * @returns {Object} - { rank: number, rankName: string }
     */
    const evaluate = async (player) => {
        const hand = player.hand.map(card => card.code);
        const result = getHandRanking(hand);

        await setDocument(['games', gameId, 'players', player?.id], { ...player, rank: result.rank, rankName: result.rankName });
        return result;
    }

    /**
     * End the game and evaluate the players' hands to determine the winner.
     * 
     * @returns {Promise<void>} - A promise that resolves when the game has ended.
     */
    const endGame = async () => {

        let winningRank = 0;
        let results = {};
        results.message = '';

        // Evaluate each player's hand and determine the winner
        await Promise.all(players.map(async player => {
            let result = await evaluate(player);
            results.message += `${player.name}: ${result.rankName}\n`;
            if (result.rank > winningRank) {
                winningRank = result.rank;
                results.winner = player.name;
            }
            else if (result.rank === winningRank) {
                results.winner = 'Tie';
            }

        }));

        results.message += `Winner: ${results.winner}`;

        try {
            setIsLoading(true);
            await setDocument(['games', gameId], { ...game, phase: 2, results: results });
        } catch (error) {
            console.error(`Error ending game: ${error}`);
            setError(`Error ending game: ${error}`);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * End the current turn and move to the next player's turn.
     * If all players have taken their turn, end the game.
     * 
     * return {Promise<void>} - A promise that resolves when the current turn is set in the database.
     */
    const endTurn = async () => {
        const newTurn = game.turn + 1;

        // If all players have taken their turn, end the game
        if (newTurn === players.length) {           
            try {
                setIsLoading(true);
                await setDocument(['games', gameId], { ...game, gameStarted: false });
                endGame();
            } catch (error) {
                console.error("Error updating document: ", error);
                setError("Error updating document: ", error);
            } finally {
                setIsLoading(false);
            }
        }
        else {
            try {
                setIsLoading(true);
                await setDocument(['games', gameId], { ...game, turn: newTurn });
            } catch (error) {
                console.error("Error updating document: ", error);
            } finally {
                setIsLoading(false);
            }
        }
    }


    if (!game) {
        return <LoadingSpinner />;
    }

    if (!player) {
        return <Alert variant="danger">{`You are not a member of ${game.name}`}</Alert>;
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>{game.name}</Card.Title>
                <Card.Text> Player Count: {players?.length} </Card.Text>
                {isGameStarted && <Card.Text> {game.order[game.turn].name === userName ? "It's your turn" : `It's ${game.order[game.turn].name}'s turn`}</Card.Text>}
                <Card.Text> Cards Remaining: {remainingCards ?? "Loading..."} </Card.Text>
                {game?.results &&
                    // Format the results message to display each line on a new line
                    <Alert variant="success">
                        {game.results.message.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </Alert>
                }
                {error && <Alert variant="danger">{error}</Alert>}
                <div className='game-board-buttons'>
                    {isGameWaiting && <Button onClick={handleStartGame} disabled={isLoading}>Start Game</Button>}
                    {isGameStarted && isYourTurn && !player.hasSwapped && <Button onClick={swapCards} disabled={isLoading}>Swap Cards</Button>}
                    {isGameStarted && isYourTurn && <Button onClick={endTurn} disabled={isLoading}>End Turn</Button>}
                </div>
                <PokerHand player={player} cardsToSwap={cardsToSwap} setCardsToSwap={setCardsToSwap} />
            </Card.Body>
        </Card>
    );
}

