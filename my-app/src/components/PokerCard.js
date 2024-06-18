import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import LoadingSpinner from './LoadingSpinner'; 

const PokerCard = ({ card, index, handleCardClick, cardsToSwap, isLoadingCards }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

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
            bg={cardsToSwap.includes(index) ? "danger" : "primary"}
            onClick={() => handleCardClick(index)}
        >
            <CardBody>
                <LoadingSpinner show={!isImageLoaded} />
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