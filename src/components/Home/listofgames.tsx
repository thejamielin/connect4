import { useState, useEffect } from "react";
import axios from "axios";
import { GameResult } from "../../types";

const API_BASE = process.env.REACT_APP_API_BASE;

function ListOfGames() {
  const [games, setGames] = useState<GameResult[]>([]);
  const searchParams = {
    count: 10,
  };

  const GAMES_API = `${API_BASE}/games/search`;
  const findAllGames = async () => {
    const response = await axios.get(GAMES_API, searchParams);
    setGames(response.data);
  };
  useEffect(() => {
    findAllGames();
  }, []);

  return (
    <div>
      {games.map((game) => (
        <GameEntry game={game} />
      ))}
    </div>
  );
}

export default ListOfGames;

function GameEntry({ game }: { game: GameResult }) {
  return (
    <div>
      <div>{game.id}</div>
      <div>{game.player1}</div>
      <div>{game.player2}</div>
      <div>{game.winner}</div>
    </div>
  );
}
