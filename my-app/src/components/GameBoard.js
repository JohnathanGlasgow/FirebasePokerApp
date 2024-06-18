/**
 * GamePage.js
 * 
 * This component displays the game page.
 */


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { subscribeToDocument, setDocument } from '../proxies/queries';
import { Alert, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { PokerHand } from './PokerHand';
import { drawCards, getRemainingCards } from '../api_services/deckQueries';
import { setDoc } from '@firebase/firestore';
import { getHandRanking } from '../utilities/evaluateHand';

/**
 * GamePage component.
 * Shows the todo list for a game if the user is a member of the game.
 * 
 * @component
 * @returns {React.JSX.Element} The rendered GamePage component.
 */
export default function GameBoard({ players, game }) {
    const { uid, userName } = useAuth();
    const { gameId } = useParams();

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [remainingCards, setRemainingCards] = useState(52);
    const [player, setPlayer] = useState(null);
    const [cardsToSwap, setCardsToSwap] = useState([]);
    const [isLoadingCards, setIsLoadingCards] = useState(false);

    const isYourTurn = game.order && game.order[game.turn].id === player?.id;
    const isGameWaiting = game.phase === 0;
    const isGameStarted = game.phase === 1;

    useEffect(() => {
        //find player that matches uid and use to setPlayer
        players &&
            setPlayer(players.find(player => player?.id === uid));
    }, [players, uid]);

    useEffect(() => {
        getRemainingCards(game?.deckId).then((cards) => {
            cards.remaining && setRemainingCards(cards.remaining);
        });
        // Note: need to work out a good way to return to the user's page if game is deleted
        //!game && navigate(`/user/${uid}`);
    }, [game]);

    async function handleStartGame() {
        if (game.phase !== 0) { return; }
        deal();
        const newPhase = game.phase + 1;
        // map name and id from players to new array turnOrder
        const turnOrder = players.map(player => ({ name: player.name, id: player?.id }));
        await setDocument(['games', gameId], { ...game, phase: newPhase, gameStarted: true, order: turnOrder });
    }

    const deal = async () => {
        console.log('Dealing cards...');
        try {
            await Promise.all(players.map(async player => {
                const cards = await drawCards(game.deckId, 5);
                setRemainingCards(cards.remaining);
                await setDocument(['games', gameId, 'players', player?.id], { hand: cards.cards });
            }));
        } catch (error) {
            console.error(`Error dealing cards: ${error}`);
        }
    }

    // function to swap cards
    const swapCards = async (cardIndexes) => {
        setIsLoadingCards(true);
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
            setIsLoadingCards(false);
        }
    }

    const evaluate = async (player) => {
        const hand = player.hand.map(card => card.code);
        const result = getHandRanking(hand);

        await setDocument(['games', gameId, 'players', player?.id], { ...player, rank: result.rank, rankName: result.rankName });
        return result;
    }

    const endGame = async () => {
        // foreach player in players, evaluate their hand
        let winningRank = 0;
        let results = {};
        results.message = '';

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
        await setDocument(['games', gameId], { ...game, phase: 2, results: results });
    }

    const endTurn = async () => {
        const newTurn = game.turn + 1;

        if (newTurn === players.length) {
            await setDocument(['games', gameId], { ...game, gameStarted: false });
            endGame();
        }
        else {
            await setDocument(['games', gameId], { ...game, turn: newTurn });
        }
    }


    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!game) {
        return <Alert variant="info">Loading...</Alert>;
    }

    if (!player) {
        return <Alert variant="danger">{`You are not a member of ${game.name}`}</Alert>;
    }
    // return a card with some test text
    return (
        <Card>
            <Card.Body>
                <Card.Title>{game.name}</Card.Title>
                <Card.Text> Player Count: {players?.length} </Card.Text>
                {isGameStarted && <Card.Text> {game.order[game.turn].name === userName ? "It's your turn" : `It's ${game.order[game.turn].name}'s turn`}</Card.Text>}
                <Card.Text> Cards Remaining: {remainingCards} </Card.Text>
                {game?.results &&
                    <Alert variant="success">
                        {game.results.message.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </Alert>
                }
                <div className='game-board-buttons'>
                    {isGameWaiting && <Button onClick={handleStartGame}>Start Game</Button>}
                    {isGameStarted && isYourTurn && !player.hasSwapped && <Button onClick={swapCards}>Swap Cards</Button>}
                    {isGameStarted && isYourTurn && <Button onClick={endTurn}>End Turn</Button>}
                </div>
                <PokerHand player={player} cardsToSwap={cardsToSwap} setCardsToSwap={setCardsToSwap} isLoadingCards={isLoadingCards} />
            </Card.Body>
        </Card>
    );
}

