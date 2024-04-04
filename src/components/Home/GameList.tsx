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
    <div style={{borderStyle: 'solid', justifyContent: 'center', display: 'flex'}}>
      <div style={{fontSize: 20, backgroundColor: 'lightblue', width: '100%'}}>
        {game.player1} <span style={{fontSize: 16}}>vs</span> {game.player2}
      </div>
    </div>
  );
}
