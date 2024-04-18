import { useState, useEffect } from "react";
import { RegularUser, User } from "../../types";
import { apiGamesSearch } from "../../dao";
import { GameResult } from "../Game/gameTypes";
import "./index.css"

export interface GameSearchParameters {
  count: number;
  sort?: "newest" | "oldest";
  filter?: {
    players?: string[];
  };
}

function GameList({userData} : {userData : RegularUser | false}) {
  const [games, setGames] = useState<GameResult[]>([]);
  
  useEffect(() => {
    let searchParams: GameSearchParameters = { count: 10, sort: 'newest' };
    if (userData) {
      searchParams.filter = { players: [userData.username] };
    }
    apiGamesSearch(searchParams).then(setGames);
  }, []);

  return (
    <div className="game-box">
      <h3>Game History</h3>
      {games.length !== 0 ?
      games.map((game, i) => (
        <GameListEntry game={game} key={i}/>
      ))
      :
      <p>Play some games to see your results!</p>
    }
    </div>
  );
}

export default GameList;

function GameListEntry({ game }: { game: GameResult }) {
  function winIcon(playerName: string) {
    return <span style={{width: '20pt', display: 'inline-block'}}>{game.winnerID === playerName && <i className="bi bi-trophy"></i>}</span>;
  }
  return (
    <div className="result-box">
      <div className="result-entry">
        <div>
          <a href={`/#/profile/${game.playerIDs[0]}`}> {winIcon(game.playerIDs[0])} {game.playerIDs[0]} </a>
          <span style={{fontSize: 16}}>vs</span>
          <a href={`/#/profile/${game.playerIDs[1]}`}> {game.playerIDs[1]}</a> {winIcon(game.playerIDs[1])}
        </div>
      </div>
    </div>
  );
}
