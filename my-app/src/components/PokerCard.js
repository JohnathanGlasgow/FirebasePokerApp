/**
 * @file        PokerCard.js
 * @description Represents a single card in the PokerHand component.
 * @author      Johnathan Glasgow
 * @date        17/06/2024
 */

import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import LoadingSpinner from './LoadingSpinner';

/**
 * PokerCard component.
 * Represents a single card in the PokerHand component.
 * 
 * @component
 * @param {Object} card - The card object.
 * @param {number} index - The index of the card in the hand.
 * @param {function} handleCardClick - The function to call when the card is clicked.
 * @param {Array<number>} cardsToSwap - The array of card indices to swap.
 * @returns {React.JSX.Element} The rendered PokerCard component.
 */
const PokerCard = ({ card, index, handleCardClick, cardsToSwap }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // This is a workaround for the onLoad event being spotty on Safari
    useEffect(() => {
        // Reset isImageLoaded state when card.image changes
        setIsImageLoaded(false);
        // Create a new Image object
        const img = new Image();
        // Set the src of the Image object
        img.src = card.image;
        // Listen for the load event
        img.onload = () => {
            // Set isImageLoaded to true when the image is loaded
            setIsImageLoaded(true);
        };
    }, [card.image]);

    return (
        <Card
            border="dark"
            // Set the background color based on whether the card is selected
            bg={cardsToSwap.includes(index) ? "danger" : "primary"}
            onClick={() => handleCardClick(index)}
        >
            <CardBody>
                <LoadingSpinner show={!isImageLoaded} opaque={true} />
                <Card.Img
                    key={index}
                    src={card.image}
                    alt="Card"
                />
            </CardBody>
        </Card>
    );
};

export default PokerCard;