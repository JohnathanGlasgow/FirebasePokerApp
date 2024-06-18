import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { PokerCard } from '../../components/PokerCard';

describe('PokerCard', () => {
  test('changes color when clicked', () => {
    const handleCardClick = jest.fn();
    const { container } = render(
      <PokerCard
        card={{ image: 'test-image.jpg' }}
        index={0}
        handleCardClick={handleCardClick}
        cardsToSwap={[]}
      />
    );

    const card = container.firstChild;
    expect(card).toHaveStyle('background-color: primary');

    fireEvent.click(card);

    // Assuming handleCardClick function changes the state and re-renders the component
    // with the clicked card index in the cardsToSwap array
    expect(handleCardClick).toHaveBeenCalledWith(0);
    expect(card).toHaveStyle('background-color: danger');
  });
});

describe('PokerCard', () => {
    test('loads and displays the image', async () => {
      const handleCardClick = jest.fn();
      const { getByAltText } = render(
        <PokerCard
          card={{ image: 'test-image.jpg' }}
          index={0}
          handleCardClick={handleCardClick}
          cardsToSwap={[]}
        />
      );
  
      const img = getByAltText('poker card');
      expect(img).toHaveAttribute('src', 'test-image.jpg');
  
      // Wait for the image to load
      await waitFor(() => expect(img).toBeVisible());
    });
  });