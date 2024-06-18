/**
 * @file        GameRoute.js
 * @description This component is what is rendered when the user navigates to the /game route.
 *              It exists to share the games and players subscriptions between the GamesCard, GameListItem and GameBoard components.
 * @author      Johnathan Glasgow
 * @date        18/06/2024
 */

import { useState } from 'react';
import { GamesCard } from './GamesCard';
import { GameBoard } from './GameBoard';

/**
 * The GameRoute component.
 * 
 * @component
 * @returns {React.JSX.Element} The rendered GameRoute component.
 */
export const GameRoute = () => {
  const [players, setPlayers] = useState(null);
  const [game, setGame] = useState(null);

  return (
    <>
      <GamesCard setGamePlayers={setPlayers} setCurrentGame={setGame} />
      {game && <GameBoard players={players} game={game} />}
    </>
  );
}

