import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { PokerHand } from '../../components/PokerHand';

describe('PokerHand', () => {
  test('renders correctly and calls handleCardClick when a card is clicked', () => {
    const setCardsToSwap = jest.fn();
    const player = {
      hand: [{ image: 'test-image.jpg' }, { image: 'test-image.jpg' }]
    };
    const { getAllByRole } = render(
      <PokerHand player={player} cardsToSwap={[]} setCardsToSwap={setCardsToSwap} />
    );

    const cards = getAllByRole('img'); // Assuming PokerCard renders an img element

    // Click the first card
    fireEvent.click(cards[0]);

    // Check if setCardsToSwap has been called
    expect(setCardsToSwap).toHaveBeenCalled();
  });
});

describe('PokerHand', () => {
  test('handleCardClick adds and removes indices from cardsToSwap', () => {
    const setCardsToSwap = jest.fn();
    const player = {
      hand: [{ image: 'test-image.jpg' }, { image: 'test-image.jpg' }]
    };
    const { getAllByRole } = render(
      <PokerHand player={player} cardsToSwap={[]} setCardsToSwap={setCardsToSwap} />
    );

    const cards = getAllByRole('img'); // Assuming PokerCard renders an img element

    // Click the first card
    fireEvent.click(cards[0]);

    // Check if setCardsToSwap has been called with a function
    expect(setCardsToSwap).toHaveBeenCalledWith(expect.any(Function));

    // Get the updater function passed to setCardsToSwap
    const updaterFunction = setCardsToSwap.mock.calls[0][0];

    // Call the updater function with an empty array and check the result
    expect(updaterFunction([])).toEqual([0]);

    // Call the updater function with an array containing 0 and check the result
    expect(updaterFunction([0])).toEqual([]);
  });
});