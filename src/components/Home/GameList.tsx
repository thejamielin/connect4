import { useState, useEffect } from "react";
import axios from "axios";
import { GameResult } from "../../types";
import { apiGamesSearch } from "../../dao";

function GameList() {
  const [games, setGames] = useState<GameResult[]>([]);
  const searchParams = {
    count: 10,
  };

  useEffect(() => {
    apiGamesSearch({count: 10}).then(setGames);
  }, []);

  return (
    <div>
      {games.map((game, i) => (
        <GameListEntry game={game} key={i}/>
      ))}
    </div>
  );
}

export default GameList;

function GameListEntry({ game }: { game: GameResult }) {
  return (
    <div>
      <div>{game.id}</div>
      <div>{game.player1}</div>
      <div>{game.player2}</div>
      <div>{game.winner}</div>
      <div>----------------------</div>
    </div>
  );
}
