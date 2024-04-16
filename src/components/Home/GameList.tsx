import { useState, useEffect } from "react";
import axios from "axios";
import { RegularUser, User } from "../../types";
import { apiGamesSearch } from "../../dao";
import { GameResult } from "../Game/gameTypes";

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
    <div style={{borderStyle: 'solid', padding: '10px', height: '100%'}}>
      <h3>Game History</h3>
      {games.map((game, i) => (
        <GameListEntry game={game} key={i}/>
      ))}
    </div>
  );
}

export default GameList;

function GameListEntry({ game }: { game: GameResult }) {
  function winIcon(playerName: string) {
    return <span style={{width: '20pt', display: 'inline-block'}}>{game.winnerID === playerName && <i className="bi bi-trophy"></i>}</span>;
  }
  return (
    <div style={{borderStyle: 'solid', margin: '2%'}}>
      <div style={{fontSize: 20, backgroundColor: 'lightblue', width: '100%', justifyContent: 'center', display: 'flex'}}>
        <div>
          <a href={`/#/profile/${game.playerIDs[0]}`}> {winIcon(game.playerIDs[0])} {game.playerIDs[0]} </a>
          <span style={{fontSize: 16}}>vs</span>
          <a href={`/#/profile/${game.playerIDs[1]}`}> {game.playerIDs[1]}</a> {winIcon(game.playerIDs[1])}
        </div>
      </div>
    </div>
  );
}
