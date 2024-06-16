// this component is a container for 5x card images
// make it contain https://www.deckofcardsapi.com/static/img/back.png for now

import { useEffect, useState } from 'react';
import { CardGroup, Card, Button, CardBody } from 'react-bootstrap';
import { subscribeToDocument } from '../proxies/queries';

/**
 * PokerHand component.
 * This component is a container for 5x card images.
 * @component
 * @returns {React.JSX.Element} The rendered PokerHand component.
 */
export const PokerHand = ({ player, setCardsToSwap }) => {
    const cardBackUrl = "https://www.deckofcardsapi.com/static/img/6H.png";
    const cardCount = 5;

    const [clickedCards, setClickedCards] = useState([]);

    useEffect(() => {
        console.log(clickedCards);
    }, [clickedCards]);

    const handleCardClick = (index) => {
        setClickedCards(prevState => {
            // Check if the card is already in the clickedCards array
            if (prevState.includes(index)) {
                // If it is, remove it from the array
                return prevState.filter(i => i !== index);
            } else {
                // If it's not, add it to the array
                return [...prevState, index];
            }
        });


        // Call the setCardsToSwap function passed from the parent component
        setCardsToSwap(prevState => {
            console.log('setCardsToSwap is called with index:', index);
            // Check if the card is already in the cardsToSwap array
            if (prevState.includes(index)) {
                // If it is, remove it from the array
                return prevState.filter(i => i !== index);
            } else {
                // If it's not, add it to the array
                return [...prevState, index];
            }
        });
    }

    useEffect(() => {
        console.log("Player: ", player);
        console.log("Player hand: ", player?.hand);
    }, [player]);

    return (
        <CardGroup style={{ maxWidth: '1000px' }}>

            {player?.hand?.map((card, index) => (
                <Card
                    border="dark"
                    bg={clickedCards.includes(index) ? "danger" : "primary"}
                    onClick={() => handleCardClick(index)}
                >
                    <CardBody>
                        <Card.Img key={index} src={card.image} alt="Card" />
                    </CardBody>
                </Card>
            ))}

        </CardGroup>
    );
}