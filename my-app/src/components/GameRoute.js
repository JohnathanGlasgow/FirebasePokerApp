import { useState } from 'react';
import GamesCard from './GamesCard';
import GameBoard from './GameBoard';

export default function GameRoute() {
    const [players, setPlayers] = useState(null);
    const [game, setGame] = useState(null);
  
    return (
      <>
        <GamesCard setGamePlayers={setPlayers} setCurrentGame={setGame} />
        <GameBoard players={players} game={game} />
      </>
    );
  }
  
